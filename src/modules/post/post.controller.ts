import { Request, Response } from "express";
import { postServices } from "./post.service";
import { PostStatus } from "../../../generated/prisma/enums";

const createPost = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(400).json({
        Error: "Unauthorized!",
      });
    }
    const result = await postServices.createPost(req.body, user.id as string);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      Error: "post creation fail",
      details: error,
    });
  }
};

const getAllPost = async (req: Request, res: Response) => {
  try {
    const { search } = req.query;
    const searchString = typeof search === "string" ? search : undefined;
    //filtering by tags
    const tags = req.query.tags ? (req.query.tags as string).split(",") : [];
    //filtering by isFeatured   true or false
    const isFeatured=req.query.isFeatured
    ? req.query.isFeatured==="true"
    ?true
    :req.query.isFeatured==="false"
    ?false
    :undefined
     :undefined
    //filtering by status
    const status=req.query.status as PostStatus | undefined
//filtering by authorId
const authorId=req.query.authorId  as string | undefined
    const result = await postServices.getAllPost({
      search: searchString,
      tags,
      isFeatured,
      status,
      authorId
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

export const postController = {
  createPost,
  getAllPost,
};
