import { pool } from "../config/db.js";

// GET all reviews (for admin)
export const getAllReviews = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.*,
        u.name as user_name,
        u.email as user_email,
        e.title as exam_title,
        e.course as exam_course,
        ar.response as admin_response,
        ar.created_at as admin_response_date,
        admin.name as admin_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN exams e ON r.exam_id = e.id
      LEFT JOIN admin_responses ar ON r.id = ar.review_id
      LEFT JOIN users admin ON ar.admin_id = admin.id
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET reviews for a specific exam
export const getExamReviews = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const [rows] = await pool.query(
      `
      SELECT 
        r.*,
        u.name as user_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.exam_id = ?
      ORDER BY r.created_at DESC
    `,
      [examId]
    );
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET user's review for a specific exam
export const getUserExamReview = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    const [rows] = await pool.query(
      `
      SELECT * FROM reviews 
      WHERE exam_id = ? AND user_id = ?
    `,
      [examId, userId]
    );

    if (rows.length === 0) {
      return res.json(null);
    }

    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// CREATE or UPDATE review
export const createOrUpdateReview = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const { rating, comment } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    // Check if review already exists
    const [existing] = await pool.query(
      `
      SELECT id FROM reviews 
      WHERE exam_id = ? AND user_id = ?
    `,
      [examId, userId]
    );

    if (existing.length > 0) {
      // Update existing review
      await pool.query(
        `
        UPDATE reviews 
        SET rating = ?, comment = ?, updated_at = CURRENT_TIMESTAMP
        WHERE exam_id = ? AND user_id = ?
      `,
        [rating, comment, examId, userId]
      );

      res.json({ message: "Review updated successfully" });
    } else {
      // Create new review
      await pool.query(
        `
        INSERT INTO reviews (exam_id, user_id, rating, comment)
        VALUES (?, ?, ?, ?)
      `,
        [examId, userId, rating, comment]
      );

      res.status(201).json({ message: "Review created successfully" });
    }
  } catch (err) {
    next(err);
  }
};

// DELETE review
export const deleteReview = async (req, res, next) => {
  try {
    const { examId } = req.params;
    const userId = req.user.id;

    const [result] = await pool.query(
      `
      DELETE FROM reviews 
      WHERE exam_id = ? AND user_id = ?
    `,
      [examId, userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    next(err);
  }
};

// DELETE general review (admin only)
export const deleteGeneralReview = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const adminId = req.user.id;

    console.log(
      `Attempting to delete general review ${reviewId} by admin ${adminId}`
    );

    // Check if review exists and is a general review (exam_id IS NULL)
    const [review] = await pool.query(
      "SELECT id, user_id, exam_id FROM reviews WHERE id = ?",
      [reviewId]
    );

    console.log(`Found review:`, review[0]);

    if (review.length === 0) {
      console.log(`Review ${reviewId} not found`);
      return res.status(404).json({ message: "Review not found" });
    }

    if (review[0].exam_id !== null) {
      console.log(
        `Review ${reviewId} is not a general review (has exam_id: ${review[0].exam_id})`
      );
      return res.status(400).json({ message: "This is not a general review" });
    }

    // Delete the review (cascade will handle admin_responses)
    const [result] = await pool.query("DELETE FROM reviews WHERE id = ?", [
      reviewId,
    ]);

    console.log(`Delete result:`, result);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    res.json({ message: "Review deleted successfully" });
  } catch (err) {
    console.error("Error deleting general review:", err);
    next(err);
  }
};

// GET review statistics for an exam
export const getExamReviewStats = async (req, res, next) => {
  try {
    const { examId } = req.params;

    const [stats] = await pool.query(
      `
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews 
      WHERE exam_id = ?
    `,
      [examId]
    );

    res.json(stats[0]);
  } catch (err) {
    next(err);
  }
};

// GET all general reviews (not exam-specific)
export const getGeneralReviews = async (req, res, next) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        r.*,
        u.name as user_name,
        ar.response as admin_response,
        ar.created_at as admin_response_date,
        admin.name as admin_name
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      LEFT JOIN admin_responses ar ON r.id = ar.review_id
      LEFT JOIN users admin ON ar.admin_id = admin.id
      WHERE r.exam_id IS NULL
      ORDER BY r.created_at DESC
    `);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET general review statistics
export const getGeneralReviewStats = async (req, res, next) => {
  try {
    const [stats] = await pool.query(`
      SELECT 
        COUNT(*) as total_reviews,
        AVG(rating) as average_rating,
        COUNT(CASE WHEN rating = 5 THEN 1 END) as five_star,
        COUNT(CASE WHEN rating = 4 THEN 1 END) as four_star,
        COUNT(CASE WHEN rating = 3 THEN 1 END) as three_star,
        COUNT(CASE WHEN rating = 2 THEN 1 END) as two_star,
        COUNT(CASE WHEN rating = 1 THEN 1 END) as one_star
      FROM reviews 
      WHERE exam_id IS NULL
    `);

    res.json(stats[0]);
  } catch (err) {
    next(err);
  }
};

// CREATE general review
export const createGeneralReview = async (req, res, next) => {
  try {
    const { rating, title, comment, category, isAnonymous } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "Rating must be between 1 and 5" });
    }

    if (!title || !comment) {
      return res
        .status(400)
        .json({ message: "Title and comment are required" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO reviews (user_id, rating, title, comment, category, is_anonymous)
      VALUES (?, ?, ?, ?, ?, ?)
    `,
      [
        userId,
        rating,
        title,
        comment,
        category || "General Feedback",
        isAnonymous || false,
      ]
    );

    res.status(201).json({
      message: "Review created successfully",
      reviewId: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};

// CREATE admin response
export const createAdminResponse = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;
    const adminId = req.user.id;

    if (!response || response.trim().length === 0) {
      return res.status(400).json({ message: "Response is required" });
    }

    // Check if review exists
    const [review] = await pool.query("SELECT id FROM reviews WHERE id = ?", [
      reviewId,
    ]);
    if (review.length === 0) {
      return res.status(404).json({ message: "Review not found" });
    }

    // Check if response already exists
    const [existingResponse] = await pool.query(
      "SELECT id FROM admin_responses WHERE review_id = ?",
      [reviewId]
    );

    if (existingResponse.length > 0) {
      return res
        .status(400)
        .json({ message: "Response already exists for this review" });
    }

    const [result] = await pool.query(
      `
      INSERT INTO admin_responses (review_id, admin_id, response)
      VALUES (?, ?, ?)
    `,
      [reviewId, adminId, response]
    );

    res.status(201).json({
      message: "Response created successfully",
      responseId: result.insertId,
    });
  } catch (err) {
    next(err);
  }
};

// UPDATE admin response
export const updateAdminResponse = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const { response } = req.body;
    const adminId = req.user.id;

    if (!response || response.trim().length === 0) {
      return res.status(400).json({ message: "Response is required" });
    }

    const [result] = await pool.query(
      `
      UPDATE admin_responses 
      SET response = ?, created_at = CURRENT_TIMESTAMP
      WHERE review_id = ? AND admin_id = ?
    `,
      [response, reviewId, adminId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Response not found or you don't have permission to update it",
      });
    }

    res.json({ message: "Response updated successfully" });
  } catch (err) {
    next(err);
  }
};

// DELETE admin response
export const deleteAdminResponse = async (req, res, next) => {
  try {
    const { reviewId } = req.params;
    const adminId = req.user.id;

    const [result] = await pool.query(
      `
      DELETE FROM admin_responses 
      WHERE review_id = ? AND admin_id = ?
    `,
      [reviewId, adminId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Response not found or you don't have permission to delete it",
      });
    }

    res.json({ message: "Response deleted successfully" });
  } catch (err) {
    next(err);
  }
};
