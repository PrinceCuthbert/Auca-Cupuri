import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import authRoutes from "./routes/auth.js";
import facultyRoutes from "./routes/faculties.js";
import courseRoutes from "./routes/courses.js";
import examRoutes from "./routes/exams.js";
import reviewRoutes from "./routes/reviews.js";
import visitRoutes from "./routes/visits.js";
import errorHandler from "./middlewares/errorHandler.js";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
const app = express();

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

//} Get allowed origins from environment or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:5174","https://cupuri-portal.vercel.app"];

// Middlewares
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true, // Allow credentials (cookies)
  })
);


app.use(cookieParser()); // Parse cookies
app.use(express.json());
app.use("/uploads", express.static("uploads")); // serve uploaded files

// Root route - browser-friendly
app.get("/", (req, res) => {
  const PORT = process.env.PORT || 3009;
  res.send(`
    <h1>🎉 Cupuri Portal Backend</h1>
    <p>Server is running on <strong>localhost:${PORT}</strong></p>
    <p>Check health: <a href="/api/health">/api/health</a></p>
  `);
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/faculties", facultyRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/exams", examRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/visits", visitRoutes);

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
