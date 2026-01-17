// controllers/authController.js
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET environment variable is required");
}

const authController = {
  // REGISTER USER
  async register(req, res, next) {
    try {
      const { name, email, password, role } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Check if user exists with detailed error handling
      let existing;
      try {
        [existing] = await pool.query(
          "SELECT * FROM users WHERE email = ?",
          [email]
        );
      } catch (dbError) {
        console.error("Database query error during registration:", dbError);
        
        // Specific database error handling
        if (dbError.code === "ECONNREFUSED") {
          return res.status(503).json({
            message: "Database connection refused. The database server may be down.",
            error: process.env.NODE_ENV === "development" ? dbError.message : undefined,
          });
        }
        
        if (dbError.code === "ETIMEDOUT" || dbError.code === "ENOTFOUND") {
          return res.status(503).json({
            message: "Database connection timeout. Please try again in a moment.",
            error: process.env.NODE_ENV === "development" ? dbError.message : undefined,
          });
        }
        
        if (dbError.code === "ER_ACCESS_DENIED_ERROR") {
          return res.status(500).json({
            message: "Database authentication failed. Please contact support.",
            error: process.env.NODE_ENV === "development" ? dbError.message : undefined,
          });
        }

        if (dbError.code === "PROTOCOL_CONNECTION_LOST") {
          return res.status(503).json({
            message: "Database connection lost. The server may be restarting. Please try again.",
            error: process.env.NODE_ENV === "development" ? dbError.message : undefined,
          });
        }
        
        // Generic database error
        return res.status(500).json({
          message: "Database error occurred during registration.",
          error: process.env.NODE_ENV === "development" ? dbError.message : undefined,
        });
      }

      if (existing.length > 0) {
        return res.status(400).json({ message: "Email is already taken" });
      }

      // Hash password with error handling
      let hashedPassword;
      try {
        hashedPassword = await bcrypt.hash(password, 10);
      } catch (bcryptError) {
        console.error("Password hashing error:", bcryptError);
        return res.status(500).json({
          message: "Password encryption failed.",
          error: process.env.NODE_ENV === "development" ? bcryptError.message : undefined,
        });
      }

      // Insert user with error handling
      try {
        await pool.query(
          "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
          [name, email, hashedPassword, role || "student"]
        );
      } catch (insertError) {
        console.error("User insertion error:", insertError);
        
        if (insertError.code === "ER_DUP_ENTRY") {
          return res.status(400).json({
            message: "Email is already registered.",
          });
        }
        
        return res.status(500).json({
          message: "Failed to create user account.",
          error: process.env.NODE_ENV === "development" ? insertError.message : undefined,
        });
      }

      res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
      console.error("Unexpected registration error:", err);
      
      // Catch-all for any unexpected errors
      res.status(500).json({
        message: "An unexpected error occurred during registration. Please try again.",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  },

  // LOGIN USER
  async login(req, res, next) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ message: "Email and password required" });
      }

      // Database query with detailed error handling
      let rows;
      try {
        [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
          email,
        ]);
      } catch (dbError) {
        console.error("Database query error during login:", dbError);
        
        // Specific database error handling
        if (dbError.code === "ECONNREFUSED") {
          return res.status(503).json({
            message: "Database connection refused. The database server may be down.",
            error: process.env.NODE_ENV === "development" ? dbError.message : undefined,
          });
        }
        
        if (dbError.code === "ETIMEDOUT" || dbError.code === "ENOTFOUND") {
          return res.status(503).json({
            message: "Database connection timeout. Please try again in a moment.",
            error: process.env.NODE_ENV === "development" ? dbError.message : undefined,
          });
        }
        
        if (dbError.code === "ER_ACCESS_DENIED_ERROR") {
          return res.status(500).json({
            message: "Database authentication failed. Please contact support.",
            error: process.env.NODE_ENV === "development" ? dbError.message : undefined,
          });
        }

        if (dbError.code === "PROTOCOL_CONNECTION_LOST") {
          return res.status(503).json({
            message: "Database connection lost. The server may be restarting. Please try again.",
            error: process.env.NODE_ENV === "development" ? dbError.message : undefined,
          });
        }
        
        // Generic database error
        return res.status(500).json({
          message: "Database error occurred during login.",
          error: process.env.NODE_ENV === "development" ? dbError.message : undefined,
        });
      }

      if (rows.length === 0)
        return res.status(400).json({ message: "Invalid credentials" });

      const user = rows[0];
      
      // Password comparison with error handling
      let match;
      try {
        match = await bcrypt.compare(password, user.password);
      } catch (bcryptError) {
        console.error("Password comparison error:", bcryptError);
        return res.status(500).json({
          message: "Authentication error occurred.",
          error: process.env.NODE_ENV === "development" ? bcryptError.message : undefined,
        });
      }
      
      if (!match)
        return res.status(400).json({ message: "Invalid credentials" });

      // JWT token generation with error handling
      let token;
      try {
        token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
          expiresIn: process.env.JWT_EXPIRES_IN || "7d",
        });
      } catch (jwtError) {
        console.error("JWT generation error:", jwtError);
        return res.status(500).json({
          message: "Token generation failed.",
          error: process.env.NODE_ENV === "development" ? jwtError.message : undefined,
        });
      }

      // Set HttpOnly cookie - configured for cross-domain deployment
      res.cookie("token", token, {
        httpOnly: true, // JavaScript cannot access this cookie
        secure: true, // Always use HTTPS
        sameSite: "none", // Allow cross-site cookies for Vercel <-> Render
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
      });

      res.json({
        user: { id: user.id, name: user.name, role: user.role },
      });
    } catch (err) {
      console.error("Unexpected login error:", err);
      
      // Catch-all for any unexpected errors
      res.status(500).json({
        message: "An unexpected error occurred during login. Please try again.",
        error: process.env.NODE_ENV === "development" ? err.message : undefined,
      });
    }
  },

  // LOGOUT USER
  logout(req, res) {
    res.clearCookie("token", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    res.json({ message: "Logged out successfully" });
  },
};

export default authController;
