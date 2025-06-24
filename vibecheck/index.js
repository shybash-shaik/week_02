import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import connectDb from "./config/db.js";
import vibeRoutes from "./routes/vibesRoute.js";
import authRoutes from "./routes/auth.js";
import commentRoutes from "./routes/comment.js";
import userRoutes from "./routes/users.js";
import feedRoutes from "./routes/feed.js";
import logger from "./middleware/logger.js";
import errorHandler from "./middleware/error.js";
dotenv.config();
const app = express();
app.use(logger);

app.use(morgan("dev"));
app.use(express.json());

connectDb();
const allVibes = [
  { id: 1, mood: "Happy", song: "thousand years", user: "shybash" },
  { id: 2, mood: "sad", song: "bekhayali", user: "mahendar" },
  { id: 3, mood: "chill", song: "natu natu", user: "jagadeesh" },
];

app.get("/movie", (req, res) => {
  console.log("hi bro");
  res.send("yeah bro im listening");
});

app.get("/", (req, res) => {
  res.status(200).send("Welcome to vibecheck-api");
});

// app.get("/vibes/:id", (req, res) => {
//   const vibeId = parseInt(req.params.id);
//   const vibe = allVibesvibes.find((v) => v.id === vibeId);

//   if (!vibe) {
//     res.status(400).json({
//       success: false,
//       message: "That vibe is off the grid, not found.",
//     });
//   }

//   res.status(200).json(vibe);
// });
app.use("/api/v1/", vibeRoutes);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1", commentRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/feed", feedRoutes);
//global catch

app.use(errorHandler);
const Port = 5000;
app.listen(Port, () => {
  console.log(`🚀 Server blasting off on port ${Port}`);
});
