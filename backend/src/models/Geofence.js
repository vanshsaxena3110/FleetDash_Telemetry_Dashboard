import mongoose from "mongoose";

const geofenceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Geofence name is required"],
      trim: true,
    },

    type: {
      type: String,
      enum: ["circle", "polygon"],
      default: "circle",
    },

    radius: {
      type: Number,
      default: 0,
    },

    lat: {
      type: Number,
      default: null,
    },

    lng: {
      type: Number,
      default: null,
    },

    positions: {
      type: [[Number]], // Array of [lat, lng] coordinate pairs for polygons
      default: undefined,
    },

    insideCount: {
      type: Number,
      default: 0,
    },

    outsideCount: {
      type: Number,
      default: 0,
    },

    lastActivity: {
      type: String,
      default: "Just now",
    },

    status: {
      type: String,
      enum: ["active", "warning", "inactive"],
      default: "active",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Geofence = mongoose.model("Geofence", geofenceSchema);

export default Geofence;
