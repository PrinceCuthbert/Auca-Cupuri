import express from "express";
import { Router } from "express";
import {
    getFaculties,
    getFacultyById,
    createFaculty,
    updateFaculty,
    deleteFaculty,
} from "../controllers/facultyController.js";

import { verifyToken } from "../middlewares/auth.js";
import { permit } from "../middlewares/roles.js";

const router = Router();

// GET all faculties
router.get("/", verifyToken, getFaculties);

// GET single faculty by ID
router.get("/:id", verifyToken, getFacultyById);

// CREATE faculty (only admin)
router.post("/", verifyToken, permit("admin"), createFaculty);

// UPDATE faculty (only admin)
router.put("/:id", verifyToken, permit("admin"), updateFaculty);

// DELETE faculty (only admin)
router.delete("/:id", verifyToken, permit("admin"), deleteFaculty);

export default router;
