import express from "express";
import http from "http";
import { Server } from "socket.io";
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
const server = http.createServer(app);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, "uploads");
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
  console.log("📁 Created uploads directory");
}

// Get allowed origins from environment or use defaults
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(",")
  : ["http://localhost:5173", "http://localhost:5174", "https://cupuri-portal.vercel.app"];

// Initialize Socket.io with CORS
const io = new Server(server, {
  cors: {
    origin: allowedOrigins,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Attach io to app so controllers can emit events via req.app.get("io")
app.set("io", io);

// Socket connection listener
io.on("connection", (socket) => {
  console.log(`⚡ WebSocket client connected: ${socket.id}`);

  socket.on("disconnect", () => {
    console.log(`❌ WebSocket client disconnected: ${socket.id}`);
  });
});

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

// Health check endpoint - tests database connection
app.get("/api/health", async (req, res) => {
  try {
    // Test database connection
    const { pool } = await import("./config/db.js");
    await pool.query("SELECT 1");
    
    res.status(200).json({
      status: "healthy",
      timestamp: new Date().toISOString(),
      database: "connected",
      uptime: process.uptime(),
    });
  } catch (error) {
    console.error("Health check failed:", error);
    res.status(503).json({
      status: "unhealthy",
      timestamp: new Date().toISOString(),
      database: "disconnected",
      error: error.message,
    });
  }
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

// Trust any proxy each time the app starts
app.set("trust proxy", 1);

// Start server using HTTP server instance (supports WebSockets)
const PORT = process.env.PORT || 3009;
server.listen(PORT, () => console.log(`🚀 Server running with WebSockets on port ${PORT}`));
