
import express from "express"
import {protect} from "../middleware/auth.middleware.js"
import {createVehicle,getVehicles} from "../controllers/vehicle.controller.js"
const router = express.Router()

router.post("/create",protect,createVehicle)
router.get("/get",protect,getVehicles)

export default router