import jwt from "jsonwebtoken";

export const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) {
    console.log("No token provided in request");
    return res.status(401).json({ error: "No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token verified, userId:", decoded.userId);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    console.error("Auth middleware error:", { message: error.message, token: token.slice(0, 20) + "..." });
    res.status(401).json({ error: "Invalid or expired token" });
  }
};