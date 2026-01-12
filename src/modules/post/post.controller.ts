import { NextFunction, Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";
import paginationSortingHelper from "../../helpers/pagination&&sortingHelpers";
import { UserRole } from "../../middlewares/auth";

const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        Error: "Unauthorized!",
      });
    }
    const result = await postServices.createPost(req.body, user.id as string);
    res.status(201).json({
      message: "post create successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    //filtering by tags
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    //filtering by isFeatured   true or false
    const isFeatured = req.query.isFeatured
      ? req.query.isFeatured === "true"
        ? true
        : req.query.isFeatured === "false"
        ? false
        : undefined
      : undefined;
    //filtering by status
    const status = req.query.status as PostStatus | undefined;
    //filtering by authorId
    const authorId = req.query.authorId as string | undefined;

    const { page, limit, skip, sortBy, sortOrder } = paginationSortingHelper(
      req.query
    );

    const result = await postServices.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId,
      page,
      limit,
      skip,
      sortBy,
      sortOrder,
    });

    res.status(200).json({
      success: true,
      message: "Post retrieved Successfully",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error,
    });
  }
};

const getPostById = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;

    if (!postId) {
      throw new Error("post id is required !");
    }
    const result = await postServices.getPostById(postId);
    res.status(200).json({
      success: true,
      message: "Post retrieved Successfully",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "post retrieved fail",
    });
  }
};

const getMyPosts = async (req: Request, res: Response) => {
  try {
    const user = req.user;

    if (!user) {
      throw new Error("You are unauthorized!");
    }
    const result = await postServices.getMyPosts(user.id);

    res.status(200).json({
      success: true,
      message: "my posts retrieved ",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: "my posts retrieved failed",
      error: error.message,
      details: error,
    });
  }
};
const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { postId } = req.params;
    const user = req.user;
    const isAdmin = user?.role === UserRole.ADMIN;
    console.log(user);
    if (!user) {
      throw new Error("You are unauthorized!");
    }

    const result = await postServices.updatePost(
      postId as string,
      req.body,
      user.id,
      isAdmin
    );

    res.status(200).json({
      success: true,
      message: " post update successfully! ",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const deletePost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const user = req.user;
    console.log(user);
    const isAdmin = user?.role === UserRole.ADMIN;
    if (!user) {
      throw new Error("You are unauthorized!");
    }

    const result = await postServices.deletePost(
      postId as string,
      user.id,
      isAdmin
    );

    res.status(200).json({
      success: true,
      message: " post delete successfully! ",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: " post delete failed",
      error: error.message,
      details: error,
    });
  }
};
const getStats = async (req: Request, res: Response) => {
  try {
    const result = await postServices.getStats();

    res.status(200).json({
      success: true,
      message: " stats fetch successfully! ",
      data: result,
    });
  } catch (error: any) {
    res.status(400).json({
      success: false,
      message: " stats fetch failed",
      error: error.message,
      details: error,
    });
  }
};

export const postController = {
  createPost,
  getAllPost,
  getPostById,
  getMyPosts,
  updatePost,
  deletePost,
  getStats,
};
