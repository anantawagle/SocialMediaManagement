import dotenv from "dotenv"; // Import dotenv here
import { validateEnv } from "./config/env.js"; // Import env validation
import { connectDB } from "./config/database.js";
import app from "./app.js";

// Load environment variables first
dotenv.config();

// Validate environment variables
validateEnv();

// Connect to MongoDB
connectDB();

app.listen(5000, () => console.log("Backend running on port 5000"));