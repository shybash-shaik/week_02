import express from "express";
import Vibe from "../models/Vibe.js";
import vibeSchema from "../models/vibeSchema.js";
import authMiddleware from "../middleware/auth.js";
import ErrorResponse from "../utils/errorResponse.js";

const router = express.Router();

router.post("/vibes", authMiddleware, async (req, res) => {
  const validationResult = vibeSchema.safeParse(req.body);
  try {
    if (!validationResult.success) {
      const formattedErrors = validationResult.error.issues.map((issue) => ({
        Path: issue.path.join("."),
        message: issue.message,
      }));

      console.log("Validation Errors:", formattedErrors);
      return res.status(400).json({
        message: "Invalid input",
        errors: formattedErrors,
      });
    }

    const validateData = validationResult.data;
    // console.log("Validation successfull! user data", validateData);

    const { mood, description } = validateData;
    const newVibe = new Vibe({ mood, description, user: req.user.userId });
    const savedVibe = await newVibe.save();
    res.status(201).json(savedVibe);
  } catch (error) {
    console.error("error posting vibe", error);
    res.status(500).json({ message: "Invalid server error" });
  }
});

router.get("/vibes/:id", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.params.id;

    const vibe = await Vibe.findById(userId);

    if (!vibe) {
      return new (ErrorResponse("Vibe not found"), 400)();
    }

    res.status(200).json(vibe);
  } catch (error) {
    next(error);
  }
});
router.get("/vibes", authMiddleware, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const total = await Vibe.countDocuments();
    const vibes = await Vibe.find()
      .populate("user", "username")
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const pagination = {};

    if (skip + limit < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (skip > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: vibes.length,
      pagination,
      data: vibes,
    });
  } catch (error) {
    console.error("error fetching vibes:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.put("/vibes/:id/like", authMiddleware, async (req, res) => {
  try {
    const vibe = await Vibe.findOne({ _id: req.params.id });

    if (!vibe) {
      return res.status(404).json({ message: "vibe not found" });
    }

    const userId = req.user.userId;

    const Liked = vibe.likes.includes(userId);

    if (Liked) {
      vibe.likes.pull(userId);
    } else {
      vibe.likes.push(userId);
    }
    await vibe.save();
    res.status(200).json({ message: Liked ? "Unliked" : "Liked" });
  } catch (error) {
    console.log("Like error", error);
    res.status(500).json({ message: "Internal Server error" });
  }
});

router.delete("/vibes/:id", authMiddleware, async (req, res, next) => {
  try {
    const userId = req.user.userId;
    const vibeId = req.params.id;

    const vibe = await Vibe.findById(vibeId);

    if (!vibe) {
      return next(new ErrorResponse("Vibe not found", 400));
    }

    if (vibe.user.toString() != userId) {
      return res
        .status(403)
        .json({ message: "Forbidden: you can only delete your own vibes " });
    }

    await Vibe.findByIdAndDelete(vibeId);
    res.status(200).json({ message: "Vibe deleted successfully" });
  } catch (error) {
    next(error);
    // console.log("Error deleting vibe:",error);
    // res.status(500).json({message:"Internal server error"});
  }
});
export default router;
