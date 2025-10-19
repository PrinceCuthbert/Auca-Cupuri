import { Router } from "express";
import {
    getCourses,
    getCourseById,
    createCourse,
    updateCourse,
    deleteCourse,
} from "../controllers/courseController.js";
import { verifyToken } from "../middlewares/auth.js";
import { permit } from "../middlewares/roles.js";

const router = Router();

router.get("/", verifyToken, getCourses);
router.get("/:id", verifyToken, getCourseById);
router.post("/", verifyToken, permit("admin"), createCourse);
router.put("/:id", verifyToken, permit("admin"), updateCourse);
router.delete("/:id", verifyToken, permit("admin"), deleteCourse);

export default router;
