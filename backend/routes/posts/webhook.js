import express from "express";
import Post from "../../models/Post.js";
import { authMiddleware } from "../../middleware/auth.js"; // Correct import path

const router = express.Router();

router.post("/predis-webhook", async (req, res) => {
  console.log("Raw webhook payload:", JSON.stringify(req.body, null, 2));
  const { post_id, status, generated_media } = req.body;

  if (status === "completed") {
    let imageUrl;
    if (generated_media?.length > 0 && generated_media[0].url) {
      imageUrl = generated_media[0].url;
    } else {
      console.warn("No generated_media.url in webhook, will fetch manually if needed:", post_id);
    }

    if (imageUrl) {
      await Post.findOneAndUpdate(
        { postId: post_id },
        { imageUrl, status },
        { upsert: true }
      );
      console.log("Image generation completed, URL saved from webhook:", imageUrl);
    }
  } else if (status === "failed") {
    console.error("Predis.ai image generation failed:", req.body);
  }

  res.status(200).send("Webhook received");
});

router.get("/post-status/:postId", authMiddleware, async (req, res) => {
  const post = await Post.findOne({ postId: req.params.postId });
  res.json(post || { status: "pending" });
});

router.get("/predis-post/:postId", authMiddleware, async (req, res) => {
  try {
    const postId = req.params.postId;
    console.log("Fetching Predis.ai post details for postId:", postId);
    const predisResponse = await axios.get(
      `https://brain.predis.ai/predis_api/v1/get_content/${postId}`,
      {
        headers: {
          "Authorization": `Bearer ${process.env.PREDIS_API_KEY}`
        }
      }
    );
    console.log("Predis.ai post details:", predisResponse.data);

    const { generated_media } = predisResponse.data;
    if (generated_media?.length > 0 && generated_media[0].url) {
      const imageUrl = generated_media[0].url;
      await Post.findOneAndUpdate(
        { postId },
        { imageUrl, status: "completed" },
        { upsert: true }
      );
      console.log("Image URL fetched and saved:", imageUrl);
      res.json({ imageUrl });
    } else {
      console.warn("No generated_media.url found in Predis.ai response:", predisResponse.data);
      res.status(404).json({ error: "No image URL found for this post" });
    }
  } catch (error) {
    console.error("Error fetching Predis.ai post:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to fetch post from Predis.ai" });
  }
});

export default router;