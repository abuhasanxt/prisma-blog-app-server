import express from "express";
import { postController } from "./post.controller";

import auth, { UserRole } from "../../middlewares/auth";

const router = express.Router();

router.get("/", postController.getAllPost);

router.get(
  "/my-posts",
  auth(UserRole.ADMIN, UserRole.USER),
  postController.getMyPosts
);
router.get("/:postId", postController.getPostById);

router.post(
  "/",
  auth(UserRole.USER, UserRole.ADMIN),
  postController.createPost
);
export const postRouter = router;
