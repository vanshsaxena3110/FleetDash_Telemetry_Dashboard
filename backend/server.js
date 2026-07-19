import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import {connectDB} from './src/config/db.js'



import authRoutes from "./src/routes/auth.routes.js"
import vehicleRoutes from "./src/routes/vehicle.routes.js"
dotenv.config()
const PORT = process.env.PORT || 8080


connectDB()

const app =  express()
app.use(cors())
app.use(express.json())

app.use("/api/auth", authRoutes);
app.use("/api/vehicle",vehicleRoutes)

app.get("/",(req,res)=>{
    res.send("server is connected")
})
app.listen( PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})