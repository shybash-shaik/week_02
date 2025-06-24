import express from "express";
import Comment from "../models/comment.js";
import Vibe from "../models/Vibe.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/vibes/:id/comments", authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    const vibeId = req.params.id;
    const userId = req.user.userId;

    const vibe = await Vibe.findById(vibeId);

    if (!vibe) {
      return res.status(404).json({ message: "Vibe not found" });
    }

    const newComment = new Comment({
      content,
      user: userId,
      vibe: vibeId,
    });

    const savedComment = await newComment.save();

    res.status(201).json({ message: "Comment added" });
  } catch (error) {
    console.log("Error posting comment", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/vibes/:vibeId/comments", authMiddleware, async (req, res) => {
  try {
    const vibeId = req.params.vibeId;

    const comments = await Comment.find({ vibe: vibeId })
      .populate("user", "username email")
      .sort({ createdAt: -1 });

    res.status(200).json(comments);
  } catch (error) {
    console.log("Error fetching comments:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
