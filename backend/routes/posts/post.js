import express from "express";
import axios from "axios";
import { TwitterApi } from "twitter-api-v2";
import FB from "fb";
import Account from "../../models/Account.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.post("/post", authMiddleware, async (req, res) => {
  const { content, platforms, imageUrl } = req.body;
  console.log("Post request received:", { content, platforms, imageUrl });

  if (!content || !platforms || platforms.length === 0) {
    console.error("Post validation failed: Missing content or platforms");
    return res.status(400).json({ error: "Content and platforms are required" });
  }

  const results = {};
  try {
    const accounts = await Account.find({ userId: req.userId, platform: { $in: platforms } });
    console.log("Fetched accounts for posting:", accounts.map(a => a.platform));

    if (platforms.includes("Twitter") && imageUrl) {
      const twitterAccount = accounts.find((acc) => acc.platform === "Twitter");
      if (!twitterAccount) {
        console.warn("Twitter not connected for userId:", req.userId);
        results.Twitter = { error: "Twitter not connected" };
      } else {
        console.log("Posting to Twitter with image...");
        const twitterClient = new TwitterApi({
          appKey: process.env.TWITTER_API_KEY,
          appSecret: process.env.TWITTER_API_SECRET,
          accessToken: twitterAccount.accessToken,
          accessSecret: twitterAccount.accessSecret,
        }).readWrite;

        const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
        const mediaId = await twitterClient.v1.uploadMedia(Buffer.from(imageResponse.data), { mimeType: "image/jpeg" });
        const response = await twitterClient.v2.tweet({
          text: content,
          media: { media_ids: [mediaId] }
        });
        console.log("Tweet with image posted:", response.data.id);
        results.Twitter = { message: "Tweet posted", tweetId: response.data.id };
      }
    } else if (platforms.includes("Twitter")) {
      const twitterAccount = accounts.find((acc) => acc.platform === "Twitter");
      if (!twitterAccount) {
        console.warn("Twitter not connected for userId:", req.userId);
        results.Twitter = { error: "Twitter not connected" };
      } else {
        console.log("Posting to Twitter (text only)...");
        const twitterClient = new TwitterApi({
          appKey: process.env.TWITTER_API_KEY,
          appSecret: process.env.TWITTER_API_SECRET,
          accessToken: twitterAccount.accessToken,
          accessSecret: twitterAccount.accessSecret,
        }).readWrite;
        const response = await twitterClient.v2.tweet(content);
        console.log("Tweet posted:", response.data.id);
        results.Twitter = { message: "Tweet posted", tweetId: response.data.id };
      }
    }

    if (platforms.includes("Facebook") && imageUrl) {
      const facebookAccount = accounts.find((acc) => acc.platform === "Facebook");
      if (!facebookAccount || !facebookAccount.pageId) {
        console.warn("Facebook not connected or page ID missing for userId:", req.userId);
        results.Facebook = { error: "Facebook not connected or page ID missing" };
      } else {
        console.log("Posting to Facebook with image...");
        FB.setAccessToken(facebookAccount.accessToken);
        const response = await new Promise((resolve, reject) => {
          FB.api(
            `/${facebookAccount.pageId}/photos`,
            "POST",
            { url: imageUrl, caption: content },
            (res) => (res.error ? reject(res.error) : resolve(res))
          );
        });
        console.log("Facebook photo posted:", response.id);
        results.Facebook = { message: "Photo posted", postId: response.id };
      }
    } else if (platforms.includes("Facebook")) {
      const facebookAccount = accounts.find((acc) => acc.platform === "Facebook");
      if (!facebookAccount || !facebookAccount.pageId) {
        console.warn("Facebook not connected or page ID missing for userId:", req.userId);
        results.Facebook = { error: "Facebook not connected or page ID missing" };
      } else {
        console.log("Posting to Facebook (text only)...");
        FB.setAccessToken(facebookAccount.accessToken);
        const response = await new Promise((resolve, reject) => {
          FB.api(`/${facebookAccount.pageId}/feed`, "POST", { message: content }, (res) =>
            res.error ? reject(res.error) : resolve(res)
          );
        });
        console.log("Facebook post created:", response.id);
        results.Facebook = { message: "Post created", postId: response.id };
      }
    }

    if (platforms.includes("Instagram") && imageUrl) {
      const instagramAccount = accounts.find((acc) => acc.platform === "Instagram");
      if (!instagramAccount) {
        console.warn("Instagram not connected for userId:", req.userId);
        results.Instagram = { error: "Instagram not connected" };
      } else {
        console.log("Mocking Instagram post for demo...");
        results.Instagram = { message: "Post created (mocked)", postId: "mock-instagram-id" };
      }
    } else if (platforms.includes("Instagram")) {
      results.Instagram = { error: "Image required for Instagram posting" };
    }

    if (platforms.includes("LinkedIn")) {
      const linkedinAccount = accounts.find((acc) => acc.platform === "LinkedIn");
      if (!linkedinAccount) {
        console.warn("LinkedIn not connected for userId:", req.userId);
        results.LinkedIn = { error: "LinkedIn not connected" };
      } else {
        const accessToken = linkedinAccount.accessToken;
        const personUrn = linkedinAccount.displayName === "LinkedIn User" ? "urn:li:person:your-linkedin-id" : linkedinAccount.displayName;

        if (imageUrl) {
          console.log("Posting to LinkedIn with image...");
          const initResponse = await axios.post(
            "https://api.linkedin.com/v2/assets?action=registerUpload",
            {
              registerUploadRequest: {
                owner: personUrn,
                recipes: ["urn:li:digitalmediaRecipe:feedshare-image"],
                serviceRelationships: [
                  {
                    identifier: "urn:li:userGeneratedContent",
                    relationshipType: "OWNER"
                  }
                ]
              }
            },
            { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
          );
          const uploadUrl = initResponse.data.value.uploadMechanism["com.linkedin.digitalmedia.uploading.MediaUploadHttpRequest"].uploadUrl;
          const assetUrn = initResponse.data.value.asset;
          console.log("LinkedIn image upload initialized:", { uploadUrl, assetUrn });

          const imageResponse = await axios.get(imageUrl, { responseType: "arraybuffer" });
          await axios.put(uploadUrl, Buffer.from(imageResponse.data), {
            headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "image/jpeg" }
          });
          console.log("Image uploaded to LinkedIn");

          const postResponse = await axios.post(
            "https://api.linkedin.com/v2/ugcPosts",
            {
              author: personUrn,
              lifecycleState: "PUBLISHED",
              specificContent: {
                "com.linkedin.ugc.ShareContent": {
                  shareCommentary: { text: content },
                  shareMediaCategory: "IMAGE",
                  media: [
                    {
                      status: "READY",
                      media: assetUrn
                    }
                  ]
                }
              },
              visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
            },
            { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
          );
          console.log("LinkedIn post with image created:", postResponse.data.id);
          results.LinkedIn = { message: "Post created", postId: postResponse.data.id };
        } else {
          console.log("Posting to LinkedIn (text only)...");
          const postResponse = await axios.post(
            "https://api.linkedin.com/v2/ugcPosts",
            {
              author: personUrn,
              lifecycleState: "PUBLISHED",
              specificContent: {
                "com.linkedin.ugc.ShareContent": {
                  shareCommentary: { text: content },
                  shareMediaCategory: "NONE"
                }
              },
              visibility: { "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC" }
            },
            { headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" } }
          );
          console.log("LinkedIn text post created:", postResponse.data.id);
          results.LinkedIn = { message: "Post created", postId: postResponse.data.id };
        }
      }
    }

    console.log("Posting completed:", results);
    res.json(results);
  } catch (error) {
    console.error("General posting error:", error.response?.data || error.message);
    res.status(500).json({ error: "Failed to post" });
  }
});

export default router;