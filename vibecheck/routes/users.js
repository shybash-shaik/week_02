import express from "express";
import User from "../models/User.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/:id/follow", authMiddleware, async (req, res) => {
  try {
    const userId = req.user.userId;
    const followId = req.params.id;

    if (userId === followId) {
      return res.status(400).json({ message: "you cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const target = await User.findById(followId);

    if (!user || !target) {
      return res.status(400).json({ message: "user not found" });
    }

    const following = user.following.includes(followId);

    if (following) {
      user.following.pull(followId);
      target.followers.pull(userId);
    } else {
      user.following.push(followId);
      target.followers.push(userId);
    }

    await user.save();
    await target.save();

    res.status(200).json({ message: following ? "Unfollowed" : "Followed" });
  } catch (error) {
    console.log("Error following user", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
