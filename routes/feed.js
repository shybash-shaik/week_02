import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";
import Vibe from "../models/Vibe.js";

const router = express.Router();

router.get("/", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;

    const user = await User.findById(userId);
    // console.log(user.email);
    const feedVibes = await Vibe.find({ user: { $in: user.following } })
      .sort({ createdAt: -1 })
      .populate("user", "username");

    res.status(200).json(feedVibes);
  } catch (error) {
    console.log("Error fetching feeds:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
