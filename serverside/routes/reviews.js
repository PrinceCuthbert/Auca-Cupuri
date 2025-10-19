import { Router } from "express";
import {
  getAllReviews,
  getExamReviews,
  getUserExamReview,
  createOrUpdateReview,
  deleteReview,
  deleteGeneralReview,
  getExamReviewStats,
  getGeneralReviews,
  getGeneralReviewStats,
  createGeneralReview,
  createAdminResponse,
  updateAdminResponse,
  deleteAdminResponse,
} from "../controllers/reviewController.js";
import { verifyToken } from "../middlewares/auth.js";
import { permit } from "../middlewares/roles.js";

const router = Router();

// GET all reviews (admin only)
router.get("/", verifyToken, permit("admin"), getAllReviews);

// GET reviews for a specific exam
router.get("/exam/:examId", verifyToken, getExamReviews);

// GET user's review for a specific exam
router.get("/exam/:examId/user", verifyToken, getUserExamReview);

// GET review statistics for an exam
router.get("/exam/:examId/stats", verifyToken, getExamReviewStats);

// CREATE or UPDATE review
router.post("/exam/:examId", verifyToken, createOrUpdateReview);

// DELETE review
router.delete("/exam/:examId", verifyToken, deleteReview);

// General reviews (not exam-specific)
router.get("/general", verifyToken, getGeneralReviews);
router.get("/general/stats", verifyToken, getGeneralReviewStats);
router.post("/general", verifyToken, createGeneralReview);
router.delete(
  "/general/:reviewId",
  verifyToken,
  permit("admin"),
  deleteGeneralReview
);

// Admin responses
router.post(
  "/:reviewId/response",
  verifyToken,
  permit("admin"),
  createAdminResponse
);
router.put(
  "/:reviewId/response",
  verifyToken,
  permit("admin"),
  updateAdminResponse
);
router.delete(
  "/:reviewId/response",
  verifyToken,
  permit("admin"),
  deleteAdminResponse
);

export default router;
