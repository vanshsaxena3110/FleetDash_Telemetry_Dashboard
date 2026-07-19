// src/middleware/auth.middleware.js
import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  try {
    let token;

    // Header format: Authorization: Bearer your_jwt_token
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer ")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({
        message: "Not authorized. Token is missing.",
      });
    }

    // Read the user ID stored inside the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach logged-in user to request for later controllers
    req.user = await User.findById(decoded.userId).select("-password");

    if (!req.user) {
      return res.status(401).json({
        message: "User not found",
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      message: "Not authorized. Invalid or expired token.",
    });
  }
};