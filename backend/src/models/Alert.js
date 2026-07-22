import mongoose from "mongoose";

const alertSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Alert title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: "",
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      default: null,
    },
    geofence: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Geofence",
      default: null,
    },
    severity: {
      type: String,
      enum: ["critical", "warning", "info"],
      default: "info",
    },
    type: {
      type: String,
      enum: ["geofence", "speed", "status", "fuel", "alert"],
      default: "alert",
    },
    isResolved: {
      type: Boolean,
      default: false,
    },
    location: {
      latitude: { type: Number, default: null },
      longitude: { type: Number, default: null },
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

const Alert = mongoose.model("Alert", alertSchema);

export default Alert;
