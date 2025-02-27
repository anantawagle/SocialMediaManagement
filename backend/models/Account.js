import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  platform: { type: String, required: true, enum: ["Twitter", "Facebook", "Instagram", "LinkedIn"] },
  accessToken: { type: String, required: true },
  accessSecret: { type: String },
  pageId: { type: String },
  displayName: { type: String },
});

export default mongoose.model("Account", accountSchema);