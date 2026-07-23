import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  addTelemetry,
  getVehicleTelemetry,
  getLatestTelemetry,
} from "../controllers/telemetry.controller.js";

const router = express.Router();

router.post("/add", protect, addTelemetry);
router.get("/vehicle/:vehicleId", protect, getVehicleTelemetry);
router.get("/vehicle/:vehicleId/latest", protect, getLatestTelemetry);

export default router;
