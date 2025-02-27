import mongoose from "mongoose";

const scheduledPostSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  content: { type: String, required: true },
  imageUrl: { type: String },
  platforms: [{ type: String, enum: ["Twitter", "Facebook", "Instagram", "LinkedIn"] }],
  scheduledAt: { type: Date, required: true },
  status: { type: String, default: "pending", enum: ["pending", "posted", "failed"] },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("ScheduledPost", scheduledPostSchema);