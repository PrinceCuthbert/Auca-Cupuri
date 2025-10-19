import { pool } from "../config/db.js";

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

// DELETE exam
export const deleteExam = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM exams WHERE id=?", [id]);
    res.json({ message: "Exam deleted" });
  } catch (err) {
    next(err);
  }
};

// UPLOAD exam with file
export const uploadExam = async (req, res, next) => {
  try {
    const { title, faculty, course, examType } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    if (!title || !faculty || !course || !examType) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Store only the filename, not the full path
    const fileName = file.filename;

    // Insert exam record with file path
    const [result] = await pool.query(
      "INSERT INTO exams (title, faculty, course, examType, filePath, uploadDate) VALUES (?, ?, ?, ?, ?, NOW())",
      [title, faculty, course, examType, fileName]
    );

    res.status(201).json({
      message: "Exam uploaded successfully",
      examId: result.insertId,
      filePath: fileName,
    });
  } catch (err) {
    console.error("Upload error:", err);
    next(err);
  }
};
