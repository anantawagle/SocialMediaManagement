import express from "express";
import axios from "axios";
import Account from "../../models/Account.js";
import { authMiddleware } from "../../middleware/auth.js";

const router = express.Router();

router.get("/linkedin/auth", authMiddleware, (req, res) => {
  try {
    console.log("Initiating LinkedIn auth for userId:", req.userId);
    const redirectUri = "http://localhost:5000/api/linkedin/callback";
    const url = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${process.env.LINKEDIN_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=w_member_social`;
    req.session.userId = req.userId;
    console.log("LinkedIn auth URL generated:", url);
    res.json({ url });
  } catch (error) {
    console.error("LinkedIn auth error:", error.message);
    res.status(500).json({ error: "Failed to initiate LinkedIn auth" });
  }
});

router.get("/linkedin/callback", async (req, res) => {
  const { code, error, error_description } = req.query;
  const { userId } = req.session;
  console.log("LinkedIn callback hit:", { code, error, error_description, userId });

  if (!userId) {
    console.error("LinkedIn callback error: Session expired");
    return res.send(`
      <script>
        window.opener.postMessage({ type: "AUTH_ERROR", error: "Session expired" }, "*");
        window.close();
      </script>
    `);
  }

  if (error) {
    console.error("LinkedIn callback OAuth error:", { error, error_description });
    return res.send(`
      <script>
        window.opener.postMessage({ type: "AUTH_ERROR", error: "${error}", description: "${error_description}" }, "*");
        window.close();
      </script>
    `);
  }

  const redirectUri = "http://localhost:5000/api/linkedin/callback";

  try {
    console.log("Requesting LinkedIn access token...");
    const { data } = await axios.post(
      "https://www.linkedin.com/oauth/v2/accessToken",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: redirectUri,
        client_id: process.env.LINKEDIN_CLIENT_ID,
        client_secret: process.env.LINKEDIN_CLIENT_SECRET,
      }).toString(),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );
    const accessToken = data.access_token;
    console.log("LinkedIn access token received:", accessToken);

    await Account.findOneAndUpdate(
      { userId, platform: "LinkedIn" },
      { accessToken, displayName: "LinkedIn User" },
      { upsert: true, new: true }
    );
    console.log("LinkedIn auth completed");
    res.send(`
      <script>
        window.opener.postMessage({ type: "AUTH_COMPLETE" }, "*");
        window.close();
      </script>
    `);
  } catch (error) {
    console.error("LinkedIn callback error:", error.response?.data || error.message);
    res.send(`
      <script>
        window.opener.postMessage({ type: "AUTH_ERROR", error: "${error.response?.data?.message || error.message}" }, "*");
        window.close();
      </script>
    `);
  }
});

export default router;