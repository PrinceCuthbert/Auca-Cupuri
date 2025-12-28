import express from "express";
import authController from "../controllers/authController.js"; // default import

const router = express.Router();

router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/logout", authController.logout);

export default router;
