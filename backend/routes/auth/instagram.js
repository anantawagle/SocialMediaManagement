import express from "express";
import axios from "axios";
import Account from "../../models/Account.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.get("/instagram/auth", authMiddleware, (req, res) => {
  try {
    console.log("Initiating Instagram auth...");
    const redirectUri = "http://localhost:5000/api/instagram/callback";
    const url = `https://api.instagram.com/oauth/authorize?client_id=${process.env.INSTAGRAM_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user_profile,user_media,instagram_basic,instagram_content_publish&response_type=code`;
    req.session.userId = req.userId;
    console.log("Instagram auth URL generated:", url);
    res.json({ url });
  } catch (error) {
    console.error("Instagram auth error:", error.message);
    res.status(500).json({ error: "Failed to initiate Instagram auth" });
  }
});

router.get("/instagram/callback", async (req, res) => {
  const { code } = req.query;
  const { userId } = req.session;
  if (!userId) {
    console.error("Instagram callback failed: Session expired");
    return res.status(400).json({ error: "Session expired" });
  }
  const redirectUri = "http://localhost:5000/api/instagram/callback";

  try {
    console.log("Processing Instagram callback...");
    const { data } = await axios.post("https://api.instagram.com/oauth/access_token", {
      client_id: process.env.INSTAGRAM_CLIENT_ID,
      client_secret: process.env.INSTAGRAM_CLIENT_SECRET,
      grant_type: "authorization_code",
      redirect_uri: redirectUri,
      code,
    });
    const accessToken = data.access_token;
    const userResponse = await axios.get(`https://graph.instagram.com/me?fields=username&access_token=${accessToken}`);
    await Account.findOneAndUpdate(
      { userId, platform: "Instagram" },
      { accessToken, displayName: userResponse.data.username },
      { upsert: true, new: true }
    );
    console.log("Instagram auth completed, connected as:", userResponse.data.username);
    res.send(`
      <script>
        window.opener.postMessage({ type: "AUTH_COMPLETE" }, "*");
        window.close();
      </script>
    `);
  } catch (error) {
    console.error("Instagram callback error:", error.message);
    res.status(500).json({ error: "Failed to complete Instagram auth" });
  }
});

export default router;