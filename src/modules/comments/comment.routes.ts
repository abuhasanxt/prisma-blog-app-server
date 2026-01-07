import express from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";
const router = express.Router();
router.get("/:commentId", commentController.getCommentById);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.createComment
);


export const commentRouter = router;
