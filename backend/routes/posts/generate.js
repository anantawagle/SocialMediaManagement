import express from "express";
import axios from "axios";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.post("/generate-post", authMiddleware, async (req, res) => {
  const { businessType, subcategory, postType, tone, prompt } = req.body;
  console.log("Generate post request received:", { businessType, subcategory, postType, tone, prompt });

  if (!businessType || !subcategory || !postType || !tone) {
    console.error("Validation failed: Missing required fields");
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    console.log("Calling Hugging Face API for text generation...");
    const aiPrompt = `Generate a ${tone} ${postType.toLowerCase()} post for a ${subcategory} ${businessType}. Additional details: "${prompt || "No additional details"}". Keep it under 200 characters (excluding hashtags) and end with 3-5 relevant hashtags starting with # within 280 characters total.`;
    const hfResponse = await axios.post(
      "https://api-inference.huggingface.co/models/mistralai/Mixtral-8x7B-Instruct-v0.1",
      { inputs: aiPrompt, parameters: { max_new_tokens: 200, temperature: 0.7, return_full_text: false } },
      { headers: { "Authorization": `Bearer ${process.env.HF_API_TOKEN}`, "Content-Type": "application/json" } }
    );
    console.log("Hugging Face response received:", hfResponse.data);

    const text = hfResponse.data[0].generated_text;
    const captionMatch = text.match(/(.+?)(?=(?:\s*#\w+){3,5}\s*$)/)?.[0]?.trim() || text.split("#")[0].trim();
    let hashtags = text.match(/#\w+/g) || ["#DefaultTag1", "#DefaultTag2", "#DefaultTag3"];
    hashtags = hashtags.slice(0, 5);

    const maxCaptionLength = 280 - hashtags.join(" ").length - 1;
    const caption = captionMatch.length > maxCaptionLength 
      ? captionMatch.slice(0, maxCaptionLength - 3) + "..." 
      : captionMatch;

    const fullPost = `${caption} ${hashtags.join(" ")}`;
    if (fullPost.length > 280) {
      console.error("Generated post exceeds 280 characters:", fullPost.length);
      throw new Error("Generated post exceeds 280 characters");
    }
    console.log("Text generated successfully:", { caption, hashtags });

    console.log("Calling Predis.ai API for image generation...");
    const predisBasePrompt = `${caption} ${hashtags.join(" ")}`.replace(/[^\x20-\x7E]/g, "");
    const predisPrompt = `${predisBasePrompt} - Optimized for Instagram square post (1:1 aspect ratio)`;
    console.log("Sanitized and enhanced Predis.ai prompt:", predisPrompt);
    const predisResponse = await axios.post(
      "https://brain.predis.ai/predis_api/v1/create_content/",
      new URLSearchParams({
        brand_id: "67ba1f3755d1750cd11a4f95",
        text: predisPrompt,
        media_type: "single_image",
        webhook_url: "https://6d80-2407-5200-405-6c30-e81b-5ca6-95b3-dd9d.ngrok-free.app/api/predis-webhook"
      }).toString(),
      {
        headers: {
          "Authorization": `Bearer ${process.env.PREDIS_API_KEY}`,
          "Content-Type": "application/x-www-form-urlencoded"
        }
      }
    );
    console.log("Predis.ai response:", {
      status: predisResponse.status,
      data: predisResponse.data
    });

    const { post_ids, post_status } = predisResponse.data;
    if (post_status !== "inProgress") {
      console.error("Predis.ai failed:", predisResponse.data);
      throw new Error("Predis.ai post creation failed: " + JSON.stringify(predisResponse.data));
    }

    console.log("Post generation initiated, awaiting webhook or manual fetch for postId:", post_ids[0]);
    res.json({ caption, hashtags, predisPostId: post_ids[0] });
  } catch (error) {
    if (error.response) {
      console.error("API error:", error.response.status, error.response.data);
      return res.status(error.response.status).json({ error: error.response.data.error || "API error" });
    }
    console.error("Generate post error:", error.message, error.stack);
    res.status(500).json({ error: "Failed to generate post" });
  }
});

export default router;