import { pool } from "../config/db.js";

// GET all courses
export const getCourses = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM courses");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET single course by ID
export const getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM courses WHERE id=?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// CREATE course
export const createCourse = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    await pool.query(
        "INSERT INTO courses (name, description) VALUES (?, ?)",
        [name, description]
    );
    res.status(201).json({ message: "Course created" });
  } catch (err) {
    next(err);
  }
};

// UPDATE course
export const updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await pool.query(
        "UPDATE courses SET name=?, description=? WHERE id=?",
        [name, description, id]
    );
    res.json({ message: "Course updated" });
  } catch (err) {
    next(err);
  }
};

// DELETE course
export const deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM courses WHERE id=?", [id]);
    res.json({ message: "Course deleted" });
  } catch (err) {
    next(err);
  }
};
