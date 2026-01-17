import { pool } from "../config/db.js";
import fs from "fs";
import path from "path";

// GET all exams
export const getExams = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM exams");
    console.log("🔍 Backend - Returning exams:", rows);
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET exam by ID
export const getExamById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM exams WHERE id=?", [id]);
    if (rows.length === 0)
      return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// CREATE exam
export const createExam = async (req, res, next) => {
  try {
    const { title, course_id, date } = req.body;
    await pool.query(
      "INSERT INTO exams (title, course_id, date) VALUES (?, ?, ?)",
      [title, course_id, date]
    );
    res.status(201).json({ message: "Exam created" });
  } catch (err) {
    next(err);
  }
};

// UPDATE exam
export const updateExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { title, course_id, date } = req.body;
    await pool.query(
      "UPDATE exams SET title=?, course_id=?, date=? WHERE id=?",
      [title, course_id, date, id]
    );
    res.json({ message: "Exam updated" });
  } catch (err) {
    next(err);
  }
};

// DELETE exam (handles single or multiple files)
export const deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;

    // First, get the file path before deleting
    const [rows] = await pool.query("SELECT filePath FROM exams WHERE id=?", [
      id,
    ]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Exam not found" });
    }

    const filePath = rows[0].filePath;

    // Delete from database
    await pool.query("DELETE FROM exams WHERE id=?", [id]);

    // Delete the file(s) from filesystem if they exist
    if (filePath) {
      // Check if it's a JSON array (multiple files) or single file
      let filesToDelete = [];
      try {
        const parsed = JSON.parse(filePath);
        if (Array.isArray(parsed)) {
          filesToDelete = parsed;
        } else {
          filesToDelete = [filePath];
        }
      } catch {
        // Not JSON, single file
        filesToDelete = [filePath];
      }

      // Delete each file
      for (const fileName of filesToDelete) {
        const fullPath = path.join(process.cwd(), "uploads", fileName);
        if (fs.existsSync(fullPath)) {
          fs.unlinkSync(fullPath);
        }
      }
    }

    res.json({ message: "Exam deleted successfully" });
  } catch (err) {
    console.error("Delete error:", err);
    next(err);
  }
};

// UPLOAD exam with file (supports single or multiple files)
export const uploadExam = async (req, res, next) => {
  try {
    const { title, faculty, course, examType } = req.body;
    const files = req.files; // Array of files

    console.log("📤 Upload request received:", {
      title,
      faculty,
      course,
      examType,
      filesCount: files?.length || 0,
    });

    // Validate file upload
    if (!files || files.length === 0) {
      console.error("❌ No files uploaded");
      return res.status(400).json({
        message: "No file uploaded. Please select at least one file.",
      });
    }

    // Validate required fields
    if (!title || !faculty || !course || !examType) {
      console.error("❌ Missing required fields:", {
        title: !!title,
        faculty: !!faculty,
        course: !!course,
        examType: !!examType,
      });
      return res.status(400).json({
        message: "All fields are required (title, faculty, course, examType).",
        missing: {
          title: !title,
          faculty: !faculty,
          course: !course,
          examType: !examType,
        },
      });
    }

    // Check if Cloudinary upload was successful
    if (!files[0].path) {
      console.error("❌ Cloudinary upload failed - no file path");
      return res.status(500).json({
        message:
          "File upload to cloud storage failed. Please check Cloudinary configuration.",
        error:
          process.env.NODE_ENV === "development"
            ? "Cloudinary path is missing"
            : undefined,
      });
    }

    // Handle single file vs multiple files - store Cloudinary URLs
    let filePath;
    let totalFileSize = 0;

    try {
      if (files.length === 1) {
        // Single file - store Cloudinary URL
        filePath = files[0].path; // Cloudinary URL
        totalFileSize = files[0].size;
        console.log("✅ Single file uploaded:", filePath);
      } else {
        // Multiple files - store as JSON array of Cloudinary URLs
        const fileUrls = files.map((f) => f.path);
        filePath = JSON.stringify(fileUrls);
        totalFileSize = files.reduce((sum, f) => sum + f.size, 0);
        console.log(`✅ ${files.length} files uploaded`);
      }
    } catch (fileProcessError) {
      console.error("❌ File processing error:", fileProcessError);
      return res.status(500).json({
        message: "Failed to process uploaded files.",
        error:
          process.env.NODE_ENV === "development"
            ? fileProcessError.message
            : undefined,
      });
    }

    // Insert exam record with Cloudinary URL and file size
    try {
      const [result] = await pool.query(
        "INSERT INTO exams (title, faculty, course, examType, filePath, fileSize, uploadDate) VALUES (?, ?, ?, ?, ?, ?, NOW())",
        [title, faculty, course, examType, filePath, totalFileSize]
      );

      console.log("✅ Exam inserted successfully:", result.insertId);

      res.status(201).json({
        message: "Exam uploaded successfully",
        examId: result.insertId,
        filePath: filePath,
        fileSize: totalFileSize,
        fileCount: files.length,
      });
    } catch (dbError) {
      console.error("❌ Database insertion error:", dbError);

      // Specific database error handling
      if (dbError.code === "ECONNREFUSED") {
        return res.status(503).json({
          message:
            "Database connection refused. The database server may be down.",
          error:
            process.env.NODE_ENV === "development"
              ? dbError.message
              : undefined,
        });
      }

      if (dbError.code === "ETIMEDOUT" || dbError.code === "ENOTFOUND") {
        return res.status(503).json({
          message:
            "Database connection timeout. Please try again in a moment.",
          error:
            process.env.NODE_ENV === "development"
              ? dbError.message
              : undefined,
        });
      }

      if (dbError.code === "ER_NO_SUCH_TABLE") {
        return res.status(500).json({
          message: "Database table not found. Please contact support.",
          error:
            process.env.NODE_ENV === "development"
              ? dbError.message
              : undefined,
        });
      }

      if (dbError.code === "ER_BAD_FIELD_ERROR") {
        return res.status(500).json({
          message: "Database schema mismatch. Please contact support.",
          error:
            process.env.NODE_ENV === "development"
              ? dbError.message
              : undefined,
        });
      }

      // Generic database error
      return res.status(500).json({
        message: "Failed to save exam to database.",
        error:
          process.env.NODE_ENV === "development"
            ? dbError.message
            : undefined,
      });
    }
  } catch (err) {
    console.error("❌ Unexpected upload error:", err);

    // Catch-all for any unexpected errors
    res.status(500).json({
      message: "An unexpected error occurred during upload. Please try again.",
      error: process.env.NODE_ENV === "development" ? err.message : undefined,
    });
  }
};

