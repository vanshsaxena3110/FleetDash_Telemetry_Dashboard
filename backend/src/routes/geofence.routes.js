import express from "express"
import {createGeofence, getGeofences, updateGeofence, deleteGeofence} from "../controllers/geofence.controller.js"
import { protect } from "../middleware/auth.middleware.js"

const router = express.Router()

router.post("/create",protect, createGeofence)
router.get("/get",protect, getGeofences)
router.patch("/update/:id",protect, updateGeofence)
router.delete("/delete/:id",protect, deleteGeofence)

export default router