import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  getAnalyticsSummary,
  getFleetPerformance,
  getTopVehicles,
} from "../controllers/analytics.controller.js";

const router = express.Router();

router.get("/summary", protect, getAnalyticsSummary);
router.get("/performance", protect, getFleetPerformance);
router.get("/top-vehicles", protect, getTopVehicles);

export default router;
