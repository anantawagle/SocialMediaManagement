import express from "express";
import bcrypt from "bcryptjs";
import User from "../models/User.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.put("/user", authMiddleware, async (req, res) => {
  const { username, password } = req.body;
  console.log("Update user attempt:", { userId: req.userId, username, password: password ? "Provided" : "Not provided" });
  try {
    const updateData = {};
    if (username) updateData.username = username;
    if (password) updateData.password = await bcrypt.hash(password, 10);

    if (Object.keys(updateData).length === 0) {
      console.log("No fields to update");
      return res.status(400).json({ error: "No fields to update" });
    }

    const user = await User.findByIdAndUpdate(req.userId, updateData, { new: true });
    if (!user) {
      console.log("User not found for update:", req.userId);
      return res.status(404).json({ error: "User not found" });
    }
    console.log("User updated:", { email: user.email, username: user.username });
    res.json({ message: "User updated", email: user.email, username: user.username });
  } catch (error) {
    console.error("User update error:", error.message);
    res.status(500).json({ error: "Failed to update user" });
  }
});

export default router;