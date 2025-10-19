// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET || "supersecret"; // use .env

const authController = {
  // REGISTER USER
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // check if exists
      const [existing] = await pool.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );
      if (existing.length > 0) {
        return res.status(400).json({ message: "Email is already taken" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await pool.query(
        "INSERT INTO users (name,email, password, role) VALUES (?, ?, ?, ?)",
        [name, email, hashedPassword, role || "student"]
      );

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error("Registration error:", err);
      if (err.code === "ER_ACCESS_DENIED_ERROR") {
        return res.status(500).json({
          message:
            "Database connection failed. Please check your database configuration.",
        });
      }
      next(err);
    }
  },

  // LOGIN USER
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
        email,
      ]);

      if (rows.length === 0)
        return res.status(400).json({ message: "Invalid credentials" });

      const user = rows[0];
      const match = await bcrypt.compare(password, user.password);
      if (!match)
        return res.status(400).json({ message: "Invalid credentials" });

      const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
        expiresIn: "1d",
      });

      res.json({
        token,
        user: { id: user.id, name: user.name, role: user.role },
      });
    } catch (err) {
      console.error("Login error:", err);
      if (err.code === "ER_ACCESS_DENIED_ERROR") {
        return res.status(500).json({
          message:
            "Database connection failed. Please check your database configuration.",
        });
      }
      res.status(500).json({ message: "Server error" });
    }
  },
};

export default authController;
