import { Request, Response } from "express";
import { postServices } from "./post.service";

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
  const result = await postServices.getAllPost();

  res.status(200).json({
    success: true,
    data: result,
  });
};

export const postController = {
  createPost,
  getAllPost,
};
