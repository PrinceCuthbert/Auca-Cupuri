import express from "express";
import rateLimit from "express-rate-limit"; // 1. Import the package
import authController from "../controllers/authController.js";
import { verifyToken } from "../middlewares/auth.js";
import { permit } from "../middlewares/roles.js";

const router = express.Router();

// 2. Define the limiter configuration
const authLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes window
  max: 5, // Limit each IP to 5 requests per window
  message: {
    message: "Too many attempts from this IP, please try again after 5 minutes."
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// 3. Apply the limiter specifically to sensitive routes
router.post("/register", authLimiter, authController.register);
router.post("/login", authLimiter, authController.login);
router.post("/logout", authController.logout);

// 🛡️ ADMIN ONLY: User Management
router.get("/users", verifyToken, permit("admin"), authController.getAllUsers);
router.delete("/users/:id", verifyToken, permit("admin"), authController.deleteUser);

export default router;