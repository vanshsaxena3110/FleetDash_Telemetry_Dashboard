
import mongoose from "mongoose";
import Vehicle from "../models/Vehicle.js";

// Convert backend fields to the names expected by your frontend
const formatVehicle = (vehicle) => ({
  id: vehicle._id,
  regNo: vehicle.vehicleNumber,
  driver: vehicle.driverName,
  driverContact: vehicle.driverContact,
  type: vehicle.type,
  status: vehicle.status,

  latitude: vehicle.currentLocation?.latitude,
  longitude: vehicle.currentLocation?.longitude,

  speed: vehicle.latestTelemetry?.speed,
  fuel: vehicle.latestTelemetry?.fuel,
  engineStatus: vehicle.latestTelemetry?.engineStatus,
  temp: vehicle.latestTelemetry?.temperature,
  voltage: vehicle.latestTelemetry?.voltage,
  distance: vehicle.latestTelemetry?.distance,
});

// POST /api/vehicles
export const createVehicle = async (req, res) => {
  try {
    const {
      vehicleNumber,
      driverName,
      driverContact,
      type,
      status,
    } = req.body;

    if (!vehicleNumber) {
      return res.status(400).json({
        message: "Vehicle number is required",
      });
    }

    const normalizedVehicleNumber = String(vehicleNumber).trim().toUpperCase();

    const existingVehicle = await Vehicle.findOne({
      vehicleNumber: normalizedVehicleNumber,
    });

    if (existingVehicle) {
      return res.status(409).json({
        message: "Vehicle number already exists",
      });
    }

    const vehicle = await Vehicle.create({
      vehicleNumber: normalizedVehicleNumber,
      driverName,
      driverContact,
      type,
      status,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Vehicle created successfully",
      vehicle: formatVehicle(vehicle),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/vehicles
export const getVehicles = async (req, res) => {
  try {
    // Only return vehicles created by the logged-in user
    const vehicles = await Vehicle.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: vehicles.length,
      vehicles: vehicles.map(formatVehicle),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// PUT /api/vehicle/update/:id
export const updateVehicle = async (req, res) => {
  try {
    const { vehicleNumber, driverName, driverContact, type, status } = req.body;

    const vehicle = await Vehicle.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    if (vehicleNumber) vehicle.vehicleNumber = vehicleNumber;
    if (driverName) vehicle.driverName = driverName;
    if (driverContact) vehicle.driverContact = driverContact;
    if (type) vehicle.type = type;
    if (status) vehicle.status = status;

    await vehicle.save();

    return res.status(200).json({
      message: "Vehicle updated successfully",
      vehicle: formatVehicle(vehicle),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/vehicle/delete/:id
export const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!vehicle) {
      return res.status(404).json({
        message: "Vehicle not found",
      });
    }

    return res.status(200).json({
      message: "Vehicle deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};