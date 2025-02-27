import express from "express";
import Account from "../models/Account.js";
import { authMiddleware } from "../middleware/auth.js";

const router = express.Router();

router.get("/accounts", authMiddleware, async (req, res) => {
  try {
    const accounts = await Account.find({ userId: req.userId }, "platform displayName");
    console.log("Fetched accounts for userId:", req.userId, accounts);
    res.json(accounts);
  } catch (error) {
    console.error("Accounts fetch error:", error.message);
    res.status(500).json({ error: "Failed to fetch accounts" });
  }
});

router.delete("/accounts/:platform", authMiddleware, async (req, res) => {
  const { platform } = req.params;
  try {
    await Account.deleteOne({ userId: req.userId, platform });
    console.log(`${platform} disconnected for userId:`, req.userId);
    res.json({ message: `${platform} disconnected` });
  } catch (error) {
    console.error(`Disconnect ${platform} error:`, error.message);
    res.status(500).json({ error: `Failed to disconnect ${platform}` });
  }
});

export default router;