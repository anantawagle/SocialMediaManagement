import express from "express";
import axios from "axios";
import ScheduledPost from "../../models/ScheduledPost.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.post("/schedule-post", authMiddleware, async (req, res) => {
  const { content, platforms, imageUrl, scheduledAt } = req.body;
  console.log("Schedule post request received:", { content, platforms, imageUrl, scheduledAt });

  if (!content || !platforms || platforms.length === 0 || !scheduledAt) {
    console.error("Schedule validation failed: Missing required fields");
    return res.status(400).json({ error: "Content, platforms, and scheduled time are required" });
  }

  try {
    const scheduledPost = new ScheduledPost({
      userId: req.userId,
      content,
      imageUrl,
      platforms,
      scheduledAt: new Date(scheduledAt),
    });
    await scheduledPost.save();
    console.log("Post scheduled successfully:", scheduledPost._id);

    const now = new Date();
    const delay = new Date(scheduledAt) - now;
    if (delay > 0) {
      setTimeout(async () => {
        try {
          const updatedPost = await ScheduledPost.findById(scheduledPost._id);
          if (updatedPost.status !== "pending") return;

          const postResponse = await axios.post(
            "http://localhost:5000/api/post",
            { content, platforms, imageUrl },
            { headers: { Authorization: `Bearer ${req.headers.authorization.split(" ")[1]}` } }
          );
          updatedPost.status = "posted";
          await updatedPost.save();
          console.log("Scheduled post executed:", updatedPost._id, postResponse.data);
        } catch (error) {
          console.error("Scheduled post error:", error.response?.data || error.message);
          const failedPost = await ScheduledPost.findById(scheduledPost._id);
          failedPost.status = "failed";
          await failedPost.save();
        }
      }, delay);
    }

    res.json({ message: "Post scheduled", scheduledPostId: scheduledPost._id });
  } catch (error) {
    console.error("Schedule post error:", error.message);
    res.status(500).json({ error: "Failed to schedule post" });
  }
});

router.get("/scheduled-posts", authMiddleware, async (req, res) => {
  try {
    const scheduledPosts = await ScheduledPost.find({ userId: req.userId });
    console.log("Fetched scheduled posts for userId:", req.userId);
    res.json(scheduledPosts);
  } catch (error) {
    console.error("Fetch scheduled posts error:", error.message);
    res.status(500).json({ error: "Failed to fetch scheduled posts" });
  }
});

export default router;