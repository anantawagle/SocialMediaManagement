import express from "express";
import axios from "axios";
import Account from "../../models/Account.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.get("/facebook/auth", authMiddleware, (req, res) => {
  try {
    console.log("Initiating Facebook auth...");
    const redirectUri = "http://localhost:5000/api/facebook/callback";
    const url = `https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.FACEBOOK_APP_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=pages_read_engagement,pages_manage_posts`;
    req.session.userId = req.userId;
    console.log("Facebook auth URL generated:", url);
    res.json({ url });
  } catch (error) {
    console.error("Facebook auth error:", error.message);
    res.status(500).json({ error: "Failed to initiate Facebook auth" });
  }
});

router.get("/facebook/callback", async (req, res) => {
  const { code } = req.query;
  const { userId } = req.session;
  if (!userId) {
    console.error("Facebook callback failed: Session expired");
    return res.status(400).json({ error: "Session expired" });
  }
  const redirectUri = "http://localhost:5000/api/facebook/callback";
  const tokenUrl = `https://graph.facebook.com/v19.0/oauth/access_token?client_id=${process.env.FACEBOOK_APP_ID}&client_secret=${process.env.FACEBOOK_APP_SECRET}&redirect_uri=${encodeURIComponent(redirectUri)}&code=${code}`;

  try {
    console.log("Processing Facebook callback...");
    const { data } = await axios.get(tokenUrl);
    const userAccessToken = data.access_token;
    const pagesResponse = await axios.get(`https://graph.facebook.com/v19.0/me/accounts?access_token=${userAccessToken}`);
    const page = pagesResponse.data.data[0];
    if (!page) throw new Error("No pages found for this account");
    await Account.findOneAndUpdate(
      { userId, platform: "Facebook" },
      { accessToken: page.access_token, pageId: page.id, displayName: page.name },
      { upsert: true, new: true }
    );
    console.log("Facebook auth completed, connected as:", page.name);
    res.send(`
      <script>
        window.opener.postMessage({ type: "AUTH_COMPLETE" }, "*");
        window.close();
      </script>
    `);
  } catch (error) {
    console.error("Facebook callback error:", error.message);
    res.status(500).json({ error: "Failed to complete Facebook auth" });
  }
});

export default router;