import { prisma } from "../../lib/prisma";

const createComment = async (payload: {
  content: string;
  authorId: string;
  postId: string;
  parentId?: string;
}) => {
  await prisma.post.findUniqueOrThrow({
    where: {
      id: payload.postId,
    },
  });

  if (payload.parentId) {
    await prisma.comment.findUniqueOrThrow({
      where: {
        id: payload.parentId,
      },
    });
  }

  const result = await prisma.comment.create({
    data: payload,
  });
  return result;
};

const getCommentById=async(commentId:string)=>{
const result=await prisma.comment.findUnique({
    where:{
        id:commentId
    },
    include:{
        post:{
            select:{
                id:true,
                title:true,
                content:true
            }
        }
    }
})
return result
}

export const commentServices = {
  createComment,
  getCommentById
};
