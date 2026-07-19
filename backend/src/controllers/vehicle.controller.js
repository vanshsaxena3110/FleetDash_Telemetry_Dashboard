
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

    const existingVehicle = await Vehicle.findOne({
      vehicleNumber: vehicleNumber.trim().toUpperCase(),
    });

    if (existingVehicle) {
      return res.status(409).json({
        message: "Vehicle number already exists",
      });
    }

    const vehicle = await Vehicle.create({
      vehicleNumber,
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