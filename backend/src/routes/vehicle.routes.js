
import express from "express"
import {protect} from "../middleware/auth.middleware.js"
import {createVehicle,getVehicles,updateVehicle,deleteVehicle} from "../controllers/vehicle.controller.js"
const router = express.Router()

router.post("/create",protect,createVehicle)
router.get("/get",protect,getVehicles)
router.patch("/update/:id",protect,updateVehicle)
router.delete("/delete/:id",protect,deleteVehicle)

export default router