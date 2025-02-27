import dotenv from "dotenv";

dotenv.config();

export const validateEnv = () => {
  const requiredVars = [
    "TWITTER_API_KEY", "TWITTER_API_SECRET", "FACEBOOK_APP_ID", "FACEBOOK_APP_SECRET",
    "INSTAGRAM_CLIENT_ID", "INSTAGRAM_CLIENT_SECRET", "LINKEDIN_CLIENT_ID", "LINKEDIN_CLIENT_SECRET",
    "MONGO_URI", "JWT_SECRET", "HF_API_TOKEN", "DEEPSEEK_API_KEY", "PREDIS_API_KEY"
  ];
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`Missing required env variable: ${varName}`);
      process.exit(1);
    }
  }
};