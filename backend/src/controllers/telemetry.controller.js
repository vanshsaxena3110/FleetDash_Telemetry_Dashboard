import mongoose from "mongoose";
import Telemetry from "../models/Telemetry.js";
import Vehicle from "../models/Vehicle.js";
import Alert from "../models/Alert.js";

/**
 * @desc    Record new telemetry entry & update vehicle status/location
 * @route   POST /api/telemetry/add
 * @access  Private
 */
export const addTelemetry = async (req, res) => {
  try {
    const {
      vehicleId,
      latitude,
      longitude,
      speed = 0,
      fuel = null,
      engineStatus = "off",
      temperature = null,
      voltage = null,
      distance = 0,
    } = req.body;

    if (!vehicleId || !mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({ message: "Valid Vehicle ID is required" });
    }

    // Find vehicle created by logged-in user
    const vehicle = await Vehicle.findOne({
      _id: vehicleId,
      createdBy: req.user._id,
    });

    if (!vehicle) {
      return res.status(404).json({ message: "Vehicle not found" });
    }

    // Determine operational status based on speed & engine status
    let vehicleStatus = "offline";
    if (engineStatus === "on") {
      vehicleStatus = speed > 0 ? "moving" : "idle";
    } else {
      vehicleStatus = "idle";
    }

    // Create telemetry record
    const telemetry = await Telemetry.create({
      vehicle: vehicle._id,
      latitude,
      longitude,
      speed,
      fuel,
      engineStatus,
      temperature,
      voltage,
      distance,
      createdBy: req.user._id,
    });

    // Update Vehicle latest state
    vehicle.currentLocation = {
      latitude: latitude ?? vehicle.currentLocation?.latitude,
      longitude: longitude ?? vehicle.currentLocation?.longitude,
      updatedAt: new Date(),
    };

    vehicle.latestTelemetry = {
      speed,
      fuel,
      engineStatus,
      temperature,
      voltage,
      distance,
    };

    vehicle.status = vehicleStatus;
    await vehicle.save();

    // Check thresholds for auto alert generation
    if (speed > 90) {
      await Alert.create({
        title: "Speeding Warning",
        description: `Vehicle ${vehicle.vehicleNumber} exceeded speed limit at ${speed} km/h`,
        vehicle: vehicle._id,
        severity: "critical",
        type: "speed",
        location: { latitude, longitude },
        createdBy: req.user._id,
      });
    }

    if (temperature && temperature > 90) {
      await Alert.create({
        title: "High Engine Temperature",
        description: `Vehicle ${vehicle.vehicleNumber} engine temperature high at ${temperature}°C`,
        vehicle: vehicle._id,
        severity: "warning",
        type: "status",
        location: { latitude, longitude },
        createdBy: req.user._id,
      });
    }

    if (fuel !== null && fuel < 15) {
      await Alert.create({
        title: "Low Fuel Alert",
        description: `Vehicle ${vehicle.vehicleNumber} fuel level is low (${fuel}%)`,
        vehicle: vehicle._id,
        severity: "warning",
        type: "fuel",
        location: { latitude, longitude },
        createdBy: req.user._id,
      });
    }

    return res.status(201).json({
      message: "Telemetry recorded successfully",
      telemetry,
      updatedVehicle: {
        id: vehicle._id,
        vehicleNumber: vehicle.vehicleNumber,
        status: vehicle.status,
        currentLocation: vehicle.currentLocation,
        latestTelemetry: vehicle.latestTelemetry,
      },
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get historical telemetry logs for a vehicle
 * @route   GET /api/telemetry/vehicle/:vehicleId
 * @access  Private
 */
export const getVehicleTelemetry = async (req, res) => {
  try {
    const { vehicleId } = req.params;
    const limit = parseInt(req.query.limit) || 50;

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({ message: "Invalid Vehicle ID format" });
    }

    const telemetryLogs = await Telemetry.find({
      vehicle: vehicleId,
      createdBy: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(limit);

    return res.status(200).json({
      count: telemetryLogs.length,
      telemetry: telemetryLogs,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * @desc    Get latest single telemetry entry for a vehicle
 * @route   GET /api/telemetry/vehicle/:vehicleId/latest
 * @access  Private
 */
export const getLatestTelemetry = async (req, res) => {
  try {
    const { vehicleId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(vehicleId)) {
      return res.status(400).json({ message: "Invalid Vehicle ID format" });
    }

    const latestTelemetry = await Telemetry.findOne({
      vehicle: vehicleId,
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    if (!latestTelemetry) {
      return res.status(404).json({ message: "No telemetry found for this vehicle" });
    }

    return res.status(200).json({
      telemetry: latestTelemetry,
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
