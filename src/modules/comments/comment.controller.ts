import { Request, Response } from "express";
import { commentServices } from "./comment.service";

const createComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    req.body.authorId = user?.id;
    const result = await commentServices.createComment(req.body);
    res.status(201).json({
      success: true,
      message: "comment create successful!",
      data: result,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "comment crate fail",
      details: error,
    });
  }
};

const getCommentById = async (req: Request, res: Response) => {
  try {
    const { commentId } = req.params;
    const result = await commentServices.getCommentById(commentId as string);
    res.status(200).json({
      success: true,
      message: "comment fetched successfully!",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "comment fetched failed",
      details: error,
    });
  }
};

const getCommentByAuthor = async (req: Request, res: Response) => {
  try {
    const { authorId } = req.params;

    const result = await commentServices.getCommentByAuthor(authorId as string);
    res.status(200).json({
      success: true,
      message: "comment fetched successfully!",
      data: result,
    });
  } catch (error) {
    res.status(404).json({
      success: false,
      message: "comment fetched failed",
      details: error,
    });
  }
};

const deleteComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentServices.deleteComment(
      commentId as string,
      user?.id as string
    );

    res.status(200).json({
      success: true,
      message: "comment delete successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "comment delete failed",
      details: error,
    });
  }
};

const updateComment = async (req: Request, res: Response) => {
  try {
    const user = req.user;
    const { commentId } = req.params;
    const result = await commentServices.updateComment(
      commentId as string,
      req.body,
      user?.id as string
    );

    res.status(200).json({
      success: true,
      message: "comment updated successfully!",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "comment update failed",
      details: error,
    });
  }
};



export const commentController = {
  createComment,
  getCommentById,
  getCommentByAuthor,
  deleteComment,
  updateComment
};
