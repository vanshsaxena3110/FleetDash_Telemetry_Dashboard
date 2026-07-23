import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import {
  createAlert,
  getAlerts,
  resolveAlert,
  deleteAlert,
  clearResolvedAlerts,
} from "../controllers/alert.controller.js";

const router = express.Router();

router.post("/create", protect, createAlert);
router.get("/get", protect, getAlerts);
router.patch("/resolve/:id", protect, resolveAlert);
router.delete("/clear-resolved", protect, clearResolvedAlerts);
router.delete("/delete/:id", protect, deleteAlert);

export default router;
