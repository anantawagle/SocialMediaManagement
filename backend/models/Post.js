import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  postId: String,
  imageUrl: String,
  status: String,
});

export default mongoose.model("Post", postSchema);