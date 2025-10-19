// controllers/facultyController.js
import { pool } from "../config/db.js";

// GET all faculties
export const getFaculties = async (req, res, next) => {
  try {
    const [rows] = await pool.query("SELECT * FROM faculties");
    res.json(rows);
  } catch (err) {
    next(err);
  }
};

// GET single faculty by ID
export const getFacultyById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query("SELECT * FROM faculties WHERE id=?", [id]);
    if (rows.length === 0) return res.status(404).json({ message: "Not found" });
    res.json(rows[0]);
  } catch (err) {
    next(err);
  }
};

// CREATE faculty
export const createFaculty = async (req, res, next) => {
  try {
    const { name, description } = req.body;
    await pool.query(
        "INSERT INTO faculties (name, description) VALUES (?, ?)",
        [name, description]
    );
    res.status(201).json({ message: "Faculty created" });
  } catch (err) {
    next(err);
  }
};

// UPDATE faculty
export const updateFaculty = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await pool.query(
        "UPDATE faculties SET name=?, description=? WHERE id=?",
        [name, description, id]
    );
    res.json({ message: "Faculty updated" });
  } catch (err) {
    next(err);
  }
};

// DELETE faculty
export const deleteFaculty = async (req, res, next) => {
  try {
    const { id } = req.params;
    await pool.query("DELETE FROM faculties WHERE id=?", [id]);
    res.json({ message: "Faculty deleted" });
  } catch (err) {
    next(err);
  }
};
