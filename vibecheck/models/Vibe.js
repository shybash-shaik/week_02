import mongoose from "mongoose";

const vibeSchema = new mongoose.Schema(
  {
    mood: {
      type: String,
      required: true,
    },
    description: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  },
  { timestamps: true }
);

const Vibe = mongoose.model("Vibe", vibeSchema);
export default Vibe;
