import express from "express";
import cors from "cors";
import session from "express-session";
import authRoutes from "./routes/auth/index.js";
import twitterRoutes from "./routes/auth/twitter.js";
import facebookRoutes from "./routes/auth/facebook.js";
import instagramRoutes from "./routes/auth/instagram.js";
import linkedinRoutes from "./routes/auth/linkedin.js";
import generatePostRoutes from "./routes/posts/generate.js";
import postRoutes from "./routes/posts/post.js";
import scheduleRoutes from "./routes/posts/schedule.js";
import webhookRoutes from "./routes/posts/webhook.js";
import accountRoutes from "./routes/accounts.js";
import userRoutes from "./routes/user.js";
import { sessionConfig } from "./config/session.js";

const app = express();

app.use(cors({
  origin: (origin, callback) => {
    const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];
    if (!origin || allowedOrigins.includes(origin)) callback(null, true);
    else callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
}));
app.use(express.json());
app.use(session(sessionConfig));

app.use("/api", authRoutes);
app.use("/api", twitterRoutes);
app.use("/api", facebookRoutes);
app.use("/api", instagramRoutes);
app.use("/api", linkedinRoutes);
app.use("/api", generatePostRoutes);
app.use("/api", postRoutes);
app.use("/api", scheduleRoutes);
app.use("/api", webhookRoutes);
app.use("/api", accountRoutes);
app.use("/api", userRoutes);

export default app;