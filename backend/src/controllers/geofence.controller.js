import mongoose from "mongoose";
import Geofence from "../models/Geofence.js";

// Format helper to match frontend key expectations
const formatGeofence = (geofence) => ({
  id: geofence._id,
  name: geofence.name,
  type: geofence.type,
  radius: geofence.radius,
  lat: geofence.lat,
  lng: geofence.lng,
  positions: geofence.positions,
  insideCount: geofence.insideCount,
  outsideCount: geofence.outsideCount,
  lastActivity: geofence.lastActivity,
  status: geofence.status,
  createdAt: geofence.createdAt,
  updatedAt: geofence.updatedAt,
});

// POST /api/geofence/create
export const createGeofence = async (req, res) => {
  try {
    const {
      name,
      type,
      radius,
      lat,
      lng,
      positions,
      insideCount,
      outsideCount,
      lastActivity,
      status,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Geofence name is required",
      });
    }

    const geofence = await Geofence.create({
      name,
      type,
      radius,
      lat,
      lng,
      positions,
      insideCount,
      outsideCount,
      lastActivity,
      status,
      createdBy: req.user._id,
    });

    return res.status(201).json({
      message: "Geofence created successfully",
      geofence: formatGeofence(geofence),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: error.message,
    });
  }
};

// GET /api/geofence/get
export const getGeofences = async (req, res) => {
  try {
    const geofences = await Geofence.find({
      createdBy: req.user._id,
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      count: geofences.length,
      geofences: geofences.map(formatGeofence),
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};

// PATCH /api/geofence/update/:id
export const updateGeofence = async (req, res) => {
  try {
    const {
      name,
      type,
      radius,
      lat,
      lng,
      positions,
      insideCount,
      outsideCount,
      lastActivity,
      status,
    } = req.body;

    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid geofence ID format",
      });
    }

    const geofence = await Geofence.findOne({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!geofence) {
      return res.status(404).json({
        message: "Geofence not found",
      });
    }

    if (name !== undefined) geofence.name = name;
    if (type !== undefined) geofence.type = type;
    if (radius !== undefined) geofence.radius = radius;
    if (lat !== undefined) geofence.lat = lat;
    if (lng !== undefined) geofence.lng = lng;
    if (positions !== undefined) geofence.positions = positions;
    if (insideCount !== undefined) geofence.insideCount = insideCount;
    if (outsideCount !== undefined) geofence.outsideCount = outsideCount;
    if (lastActivity !== undefined) geofence.lastActivity = lastActivity;
    if (status !== undefined) geofence.status = status;

    await geofence.save();

    return res.status(200).json({
      message: "Geofence updated successfully",
      geofence: formatGeofence(geofence),
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      return res.status(400).json({
        message: error.message,
      });
    }
    return res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE /api/geofence/delete/:id
export const deleteGeofence = async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({
        message: "Invalid geofence ID format",
      });
    }

    const geofence = await Geofence.findOneAndDelete({
      _id: req.params.id,
      createdBy: req.user._id,
    });

    if (!geofence) {
      return res.status(404).json({
        message: "Geofence not found",
      });
    }

    return res.status(200).json({
      message: "Geofence deleted successfully",
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
