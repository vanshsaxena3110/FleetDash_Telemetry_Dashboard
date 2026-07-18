import express from "express"
import dotenv from "dotenv"
import {connectDB} from './src/config/db.js'



import authRoutes from "./src/routes/auth.routes.js"
dotenv.config()
const PORT = process.env.PORT || 8080


connectDB()

const app =  express()
app.use(express.json())

app.use("/api/auth", authRoutes);

app.get("/",(req,res)=>{
    res.send("server is connected")
})
app.listen( PORT,()=>{
    console.log(`Server is running on port ${PORT}`)
})