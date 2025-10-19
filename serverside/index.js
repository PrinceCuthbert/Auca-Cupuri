import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/auth.js";
import facultyRoutes from "./routes/faculties.js";
import courseRoutes from "./routes/courses.js";
import examRoutes from "./routes/exams.js";
import reviewRoutes from "./routes/reviews.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();
const app = express();

// Middlewares
app.use(cors());
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

// Error handler
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3009;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
