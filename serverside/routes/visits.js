import { Router } from "express";
import {
  logVisit,
  getVisitStats,
  getHourlyVisits,
} from "../controllers/visitController.js";
import { verifyToken } from "../middlewares/auth.js";
import { permit } from "../middlewares/roles.js";

const router = Router();

// Log a visit (any authenticated user)
router.post("/log", verifyToken, logVisit);

// Get visit statistics (admin only)
router.get("/stats", verifyToken, permit("admin"), getVisitStats);

// Get hourly visits for a specific day (admin only)
router.get("/hourly", verifyToken, permit("admin"), getHourlyVisits);

export default router;
