// import { Router } from "express";
// import {
//   getAllReviews,
//   getExamReviews,
//   getUserExamReview,
//   createOrUpdateReview,
//   deleteReview,
//   deleteGeneralReview,
//   getExamReviewStats,
//   getGeneralReviews,
//   getGeneralReviewStats,
//   createGeneralReview,
//   createAdminResponse,
//   updateAdminResponse,
//   deleteAdminResponse,
// } from "../controllers/reviewController.js";
// import { verifyToken } from "../middlewares/auth.js";
// import { permit } from "../middlewares/roles.js";
// import pool from "../config/db.js"; // Add this import

// const router = Router();

// // GET all reviews (admin only)
// router.get("/", verifyToken, permit("admin"), getAllReviews);

// // GET reviews for a specific exam
// router.get("/exam/:examId", verifyToken, getExamReviews);

// // GET user's review for a specific exam
// router.get("/exam/:examId/user", verifyToken, getUserExamReview);

// // GET review statistics for an exam
// router.get("/exam/:examId/stats", verifyToken, getExamReviewStats);

// // CREATE or UPDATE review
// router.post("/exam/:examId", verifyToken, createOrUpdateReview);

// // DELETE review
// router.delete("/exam/:examId", verifyToken, deleteReview);

// // General reviews (not exam-specific)
// router.get("/general", verifyToken, getGeneralReviews);
// router.get("/general/stats", verifyToken, getGeneralReviewStats);

// // Get user's own reviews - MUST be before /general/:reviewId routes
// router.get("/my-reviews", verifyToken, async (req, res) => {
//   try {
//     const userId = req.user.id;

//     const [reviews] = await pool.query(
//       `SELECT
//         id,
//         rating,
//         title,
//         comment,
//         category,
//         is_anonymous,
//         created_at,
//         admin_response,
//         admin_response_date
//       FROM general_reviews
//       WHERE user_id = ?
//       ORDER BY created_at DESC`,
//       [userId]
//     );

//     res.json(reviews);
//   } catch (error) {
//     console.error("Error fetching user reviews:", error);
//     res.status(500).json({ message: "Failed to fetch reviews" });
//   }
// });

// router.post("/general", verifyToken, createGeneralReview);

// // Update a general review - Add this new route
// router.put("/general/:reviewId", verifyToken, async (req, res) => {
//   try {
//     const { reviewId } = req.params;
//     const userId = req.user.id;
//     const { rating, title, comment, category, isAnonymous } = req.body;

//     // Check if review exists and belongs to user
//     const [existingReview] = await pool.query(
//       "SELECT * FROM general_reviews WHERE id = ? AND user_id = ?",
//       [reviewId, userId]
//     );

//     if (existingReview.length === 0) {
//       return res.status(404).json({
//         message: "Review not found or you don't have permission to edit it",
//       });
//     }

//     // Update the review
//     await pool.query(
//       `UPDATE general_reviews
//        SET rating = ?, title = ?, comment = ?, category = ?, is_anonymous = ?
//        WHERE id = ? AND user_id = ?`,
//       [rating, title, comment, category, isAnonymous, reviewId, userId]
//     );

//     res.json({ message: "Review updated successfully" });
//   } catch (error) {
//     console.error("Error updating review:", error);
//     res.status(500).json({ message: "Failed to update review" });
//   }
// });

// // Delete a general review - Update this route to allow students to delete their own
// router.delete("/general/:reviewId", verifyToken, async (req, res) => {
//   try {
//     const { reviewId } = req.params;
//     const userId = req.user.id;
//     const userRole = req.user.role;

//     // Check if review exists
//     const [existingReview] = await pool.query(
//       "SELECT * FROM general_reviews WHERE id = ?",
//       [reviewId]
//     );

//     if (existingReview.length === 0) {
//       return res.status(404).json({ message: "Review not found" });
//     }

//     // Allow deletion if user is admin OR if it's their own review
//     if (userRole !== "admin" && existingReview[0].user_id !== userId) {
//       return res.status(403).json({
//         message: "You don't have permission to delete this review",
//       });
//     }

//     // Delete the review
//     await pool.query("DELETE FROM general_reviews WHERE id = ?", [reviewId]);

//     res.json({ message: "Review deleted successfully" });
//   } catch (error) {
//     console.error("Error deleting review:", error);
//     res.status(500).json({ message: "Failed to delete review" });
//   }
// });

// // Admin responses
// router.post(
//   "/:reviewId/response",
//   verifyToken,
//   permit("admin"),
//   createAdminResponse
// );
// router.put(
//   "/:reviewId/response",
//   verifyToken,
//   permit("admin"),
//   updateAdminResponse
// );
// router.delete(
//   "/:reviewId/response",
//   verifyToken,
//   permit("admin"),
//   deleteAdminResponse
// );

// export default router;
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
import { pool } from "../config/db.js";

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

// Get user's own reviews - WITH admin response data
router.get("/my-reviews", verifyToken, async (req, res) => {
  try {
    const userId = req.user.id;

    const [reviews] = await pool.query(
      `SELECT 
        gr.id,
        gr.rating,
        gr.title,
        gr.comment,
        gr.category,
        gr.is_anonymous,
        gr.created_at,
        ar.response as admin_response,
        ar.created_at as admin_response_date,
        u.username as admin_name
      FROM general_reviews gr
      LEFT JOIN admin_responses ar ON gr.id = ar.review_id
      LEFT JOIN users u ON ar.admin_id = u.id
      WHERE gr.user_id = ?
      ORDER BY gr.created_at DESC`,
      [userId]
    );

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching user reviews:", error);
    res.status(500).json({ message: "Failed to fetch reviews" });
  }
});

// Update and delete routes
router.put("/general/:reviewId", verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const { rating, title, comment, category, isAnonymous } = req.body;

    const [existingReview] = await pool.query(
      "SELECT * FROM general_reviews WHERE id = ? AND user_id = ?",
      [reviewId, userId]
    );

    if (existingReview.length === 0) {
      return res.status(404).json({
        message: "Review not found or you don't have permission to edit it",
      });
    }

    await pool.query(
      `UPDATE general_reviews 
       SET rating = ?, title = ?, comment = ?, category = ?, is_anonymous = ?
       WHERE id = ? AND user_id = ?`,
      [rating, title, comment, category, isAnonymous, reviewId, userId]
    );

    res.json({ message: "Review updated successfully" });
  } catch (error) {
    console.error("Error updating review:", error);
    res.status(500).json({ message: "Failed to update review" });
  }
});

router.delete("/general/:reviewId", verifyToken, async (req, res) => {
  try {
    const { reviewId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const [existingReview] = await pool.query(
      "SELECT * FROM general_reviews WHERE id = ?",
      [reviewId]
    );

    if (existingReview.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (userRole !== "admin" && existingReview[0].user_id !== userId) {
      return res.status(403).json({
        message: "You don't have permission to delete this review",
      });
    }

    await pool.query("DELETE FROM general_reviews WHERE id = ?", [reviewId]);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(500).json({ message: "Failed to delete review" });
  }
});

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
