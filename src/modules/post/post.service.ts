import {
  CommentStatus,
  Post,
  PostStatus,
} from "../../../generated/prisma/client";
import { PostWhereInput } from "../../../generated/prisma/models";
import { prisma } from "../../lib/prisma";

const createPost = async (
  data: Omit<Post, "id" | "createdAt" | "updatedAt" | "authorId">,
  userId: string
) => {
  const result = await prisma.post.create({
    data: {
      ...data,
      authorId: userId,
    },
  });
  return result;
};

const getAllPost = async ({
  search,
  tags,
  isFeatured,
  status,
  authorId,
  page,
  limit,
  skip,
  sortBy,
  sortOrder,
}: {
  search: string | undefined;
  tags: string[] | [];
  isFeatured: boolean | undefined;
  status: PostStatus | undefined;
  authorId: string | undefined;
  page: number;
  limit: number;
  skip: number;
  sortBy: string;
  sortOrder: string;
}) => {
  const andCondition: PostWhereInput[] = [];
  if (search) {
    andCondition.push({
      OR: [
        {
          title: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          content: {
            contains: search,
            mode: "insensitive",
          },
        },
        {
          tags: {
            has: search,
          },
        },
      ],
    });
  }

  if (tags.length > 0) {
    andCondition.push({
      tags: {
        hasEvery: tags as string[],
      },
    });
  }

  if (typeof isFeatured === "boolean") {
    andCondition.push({
      isFeatured,
    });
  }
  if (status) {
    andCondition.push({
      status,
    });
  }
  if (authorId) {
    andCondition.push({
      authorId,
    });
  }
  const result = await prisma.post.findMany({
    //pagination
    take: limit,
    skip,
    //filtering
    where: {
      AND: andCondition,
    },
    // sorting
    orderBy: {
      [sortBy]: sortOrder,
    },
    //comment count
    include: {
      _count: {
        select: { comments: true },
      },
    },
  });
  const count = await prisma.post.count({
    where: {
      AND: andCondition,
    },
  });
  return {
    data: result,
    pagination: {
      count,
      page,
      limit,
      totalPages: Math.ceil(count / limit),
    },
  };
};
const getPostById = async (postId: string) => {
  return await prisma.$transaction(async (tx) => {
    //views count
    await tx.post.update({
      where: {
        id: postId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
    //get by post
    const postData = await tx.post.findUnique({
      where: {
        id: postId,
      },
      include: {
        comments: {
          where: {
            parentId: null,
            status: CommentStatus.APPROVED,
          },
          orderBy: { cratedAt: "desc" },
          include: {
            replies: {
              where: {
                status: CommentStatus.APPROVED,
              },
              orderBy: { cratedAt: "asc" },
              include: {
                replies: {
                  where: {
                    status: CommentStatus.APPROVED,
                  },
                  orderBy: { cratedAt: "asc" },
                },
              },
            },
          },
        },
        _count: {
          select: {
            comments: true,
          },
        },
      },
    });
    return postData;
  });
};

const getMyPosts = async (authorId: string) => {
  //if user active
  await prisma.user.findFirstOrThrow({
    where: {
      id: authorId,
      status: "ACTIVE",
    },
    select: {
      id: true,
    },
  });

  const result = await prisma.post.findMany({
    where: {
      authorId,
    },
    orderBy: {
      cratedAt: "desc",
    },
    //comment count
    include: {
      _count: {
        select: {
          comments: true,
        },
      },
    },
  });
  const totalPost = await prisma.post.count({
    where: {
      authorId,
    },
  });
  return {
    data: result,
    totalPost,
  };
};

const updatePost = async (
  postId: string,
  data: Partial<Post>,
  authorId: string,
  isAdmin: boolean
) => {
  const postData = await prisma.post.findUniqueOrThrow({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
    },
  });

  if (!isAdmin && postData.authorId !== authorId) {
    throw new Error("You are not the owner/creator of the post");
  }

  if (!isAdmin) {
    delete data.isFeatured
  }
  const result = await prisma.post.update({
    where: {
      id: postData.id,
    },
    data,
  });
  return result;
};
export const postServices = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
};
