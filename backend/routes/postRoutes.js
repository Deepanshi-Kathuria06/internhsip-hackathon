import express from "express";
import {
  createPost,
  getPosts,
  addReply,
  upvotePost,
  markAnswered,
} from "../controllers/postController.js";

const router = express.Router();

// Routes
router.post("/", createPost);
router.get("/", getPosts);
router.post("/:id/reply", addReply);
router.post("/:id/upvote", upvotePost);
router.post("/:id/mark", markAnswered);

export default router;
