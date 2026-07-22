import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getDashboardSummary,
  getRecentAlerts,
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/summary", protect, getDashboardSummary);
router.get("/alerts", protect, getRecentAlerts);

export default router;
