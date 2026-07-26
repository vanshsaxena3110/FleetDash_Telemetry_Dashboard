import express from "express";
import http from "http";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./src/config/db.js";
import { initSocket } from "./src/sockets/socket.js";

import authRoutes from "./src/routes/auth.routes.js";
import vehicleRoutes from "./src/routes/vehicle.routes.js";
import geofenceRoutes from "./src/routes/geofence.routes.js";
import dashboardRoutes from "./src/routes/dashboard.routes.js";
import alertRoutes from "./src/routes/alert.routes.js";
import telemetryRoutes from "./src/routes/telemetry.routes.js";
import analyticsRoutes from "./src/routes/analytics.routes.js";

dotenv.config();
const PORT = process.env.PORT || 8080;

connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/vehicle", vehicleRoutes);
app.use("/api/geofence", geofenceRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/alert", alertRoutes);
app.use("/api/telemetry", telemetryRoutes);
app.use("/api/analytics", analyticsRoutes);

app.get("/", (req, res) => {
  res.send("Server & Socket.io connected");
});

// Attach Express app to HTTP server & Socket.io instance
const server = http.createServer(app);
initSocket(server);

server.listen(PORT, () => {
  console.log(`Server & Socket.io running on port ${PORT}`);
});