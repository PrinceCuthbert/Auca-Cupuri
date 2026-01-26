import { Router } from "express";
import multer from "multer";
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

// Configure multer with Cloudinary storage
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
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
  upload.array("exam", 10), // Allow up to 10 files
  uploadExam
);
router.put("/:id", verifyToken, permit("admin"), updateExam);
router.delete("/:id", verifyToken, permit("admin"), deleteExam);

export default router;
