import express from "express";
import { TwitterApi } from "twitter-api-v2";
import Account from "../../models/Account.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.get("/twitter/auth", authMiddleware, async (req, res) => {
  try {
    console.log("Initiating Twitter auth...");
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
    });
    const { url, oauth_token, oauth_token_secret } = await twitterClient.generateAuthLink(
      "http://localhost:5000/api/twitter/callback"
    );
    req.session.oauthToken = oauth_token;
    req.session.oauthTokenSecret = oauth_token_secret;
    req.session.userId = req.userId;
    console.log("Twitter auth URL generated:", url);
    res.json({ url });
  } catch (err) {
    console.error("Twitter auth error:", err.message);
    res.status(500).json({ error: "Failed to initiate Twitter auth" });
  }
});

router.get("/twitter/callback", async (req, res) => {
  const { oauth_token, oauth_verifier } = req.query;
  const { oauthToken, oauthTokenSecret, userId } = req.session;

  if (!userId || !oauthToken || !oauthTokenSecret || oauth_token !== oauthToken) {
    console.error("Twitter callback failed: Session expired or invalid token");
    return res.status(400).json({ error: "Session expired or invalid token" });
  }

  try {
    console.log("Processing Twitter callback...");
    const twitterClient = new TwitterApi({
      appKey: process.env.TWITTER_API_KEY,
      appSecret: process.env.TWITTER_API_SECRET,
      accessToken: oauth_token,
      accessSecret: oauthTokenSecret,
    });
    const { accessToken, accessSecret, screenName } = await twitterClient.login(oauth_verifier);
    await Account.findOneAndUpdate(
      { userId, platform: "Twitter" },
      { accessToken, accessSecret, displayName: screenName },
      { upsert: true, new: true }
    );
    console.log("Twitter auth completed, connected as:", screenName);
    res.send(`
      <script>
        window.opener.postMessage({ type: "AUTH_COMPLETE" }, "*");
        window.close();
      </script>
    `);
  } catch (error) {
    console.error("Twitter callback error:", error.message);
    res.status(500).json({ error: "Failed to complete Twitter auth" });
  }
});

export default router;