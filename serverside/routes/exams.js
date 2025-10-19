import { Router } from "express";
import multer from "multer";
import path from "path";
import {
  getExams,
  getExamById,
  createExam,
  updateExam,
  deleteExam,
  uploadExam,
} from "../controllers/examController.js";
import { verifyToken } from "../middlewares/auth.js";
import { permit } from "../middlewares/roles.js";

const router = Router();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname)
    );
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /pdf|doc|docx|jpg|jpeg|png/;
    const extname = allowedTypes.test(
      path.extname(file.originalname).toLowerCase()
    );
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Only PDF, DOC, DOCX, JPG, PNG files are allowed!"));
    }
  },
});

router.get("/", verifyToken, getExams);
router.get("/:id", verifyToken, getExamById);
router.post("/", verifyToken, permit("admin"), createExam);
router.post(
  "/upload",
  verifyToken,
  permit("admin", "student"),
  upload.single("exam"),
  uploadExam
);
router.put("/:id", verifyToken, permit("admin"), updateExam);
router.delete("/:id", verifyToken, permit("admin"), deleteExam);

export default router;
