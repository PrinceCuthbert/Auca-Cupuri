import { Router } from "express";
import multer from "multer";
import rateLimit from "express-rate-limit";
import { storage } from "../config/cloudinary.js";
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  uploadExam,
  downloadExam,
} from "../controllers/examController.js";
import { verifyToken } from "../middlewares/auth.js";
import { permit } from "../middlewares/roles.js";

const router = Router();

// 2. Define the upload rate limiter
// Example: Max 10 upload requests per hour per IP
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 10, 
  message: {
    message: "You have exceeded the maximum number of uploads per hour. Please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Configure multer with Cloudinary storage and strict filtering
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 20 * 1024 * 1024, // 20MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/png",
      "image/jpg",
      "image/heic",
      "image/heif"
    ];

    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only PDF, Word, and Images (including HEIC) are allowed."), false);
    }
  },
});

router.get("/", verifyToken, getExams);
router.get("/download/:id", verifyToken, downloadExam); // Proxy Download Route
router.get("/:id", verifyToken, getExamById);
router.post("/", verifyToken, permit("admin"), createExam);
router.post(
  "/upload",
  verifyToken,
  permit("admin", "student"),
   uploadLimiter,
  upload.array("exam", 10),
  uploadExam
);
router.put("/:id", verifyToken, permit("admin"), updateExam);
router.delete("/:id", verifyToken, permit("admin"), deleteExam);

export default router;
