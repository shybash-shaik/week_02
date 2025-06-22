import express from "express";
import signupSchema from "../models/signupSchema.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/signup", async (req, res) => {
  const validationResult = signupSchema.safeParse(req.body);
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
    console.log("Validation successfull! user data", validateData);
    const { username, email, password } = validateData;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(409).json({ message: "User already exists" });
    }

    const hasedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ username, email, password: hasedPassword });
    await newUser.save();

    const token = jwt.sign(
      { userId: newUser._id },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "12h" }
    );
    res.status(201).json({
      message: "User registered successfully",
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "servor error" });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ error: "Invalid email" });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      res.status(401).json({ error: "Invalid password" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    res.status(200).json({ message: "user successfully logged in", token });
  } catch (error) {
    console.log("Login error:", error);
    res.status(400).json({ error: error.message });
  }
});

export default router;
