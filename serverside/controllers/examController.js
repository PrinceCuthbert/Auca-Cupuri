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

    if (!files || files.length === 0) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!title || !faculty || !course || !examType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Handle single file vs multiple files
    let filePath;
    let totalFileSize = 0;

    if (files.length === 1) {
      // Single file - store as string (backward compatible)
      filePath = files[0].filename;
      totalFileSize = files[0].size;
    } else {
      // Multiple files - store as JSON array
      const fileNames = files.map((f) => f.filename);
      filePath = JSON.stringify(fileNames);
      totalFileSize = files.reduce((sum, f) => sum + f.size, 0);
    }

    // Insert exam record with file path and file size
    const [result] = await pool.query(
      "INSERT INTO exams (title, faculty, course, examType, filePath, fileSize, uploadDate) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [title, faculty, course, examType, filePath, totalFileSize]
    );

    res.status(201).json({
      message: "Exam uploaded successfully",
      examId: result.insertId,
      filePath: filePath,
      fileSize: totalFileSize,
      fileCount: files.length,
    });
  } catch (err) {
    console.error("Upload error:", err);
    next(err);
  }
};
