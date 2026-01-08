import express from "express";
import { commentController } from "./comment.controller";
import auth, { UserRole } from "../../middlewares/auth";
const router = express.Router();
router.get("/:commentId", commentController.getCommentById);
router.get("/author/:authorId", commentController.getCommentByAuthor);
router.post(
  "/",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.createComment
);

router.patch(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.updateComment
);

router.patch(
  "/:commentId/moderate",
  auth(UserRole.ADMIN),
  commentController.moderateComment
);
router.delete(
  "/:commentId",
  auth(UserRole.ADMIN, UserRole.USER),
  commentController.deleteComment
);

export const commentRouter = router;
