// backend/routes/analyticsRoutes.js
import express from "express";
import Post from "../models/postModel.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const totalPosts = await Post.countDocuments();
    const totalReplies = (await Post.find()).reduce(
      (sum, post) => sum + post.replies.length,
      0
    );
    const totalUpvotes = (await Post.find()).reduce(
      (sum, post) => sum + post.votes,
      0
    );

    res.json({ totalPosts, totalReplies, totalUpvotes });
  } catch (err) {
    res.status(500).json({ message: "Analytics error", error: err.message });
  }
});

export default router;
