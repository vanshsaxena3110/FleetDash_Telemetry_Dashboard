import mongoose from "mongoose";

const telemetrySchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vehicle",
      required: [true, "Vehicle ID is required"],
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    speed: {
      type: Number,
      default: 0,
    },
    fuel: {
      type: Number,
      default: null,
    },
    engineStatus: {
      type: String,
      enum: ["on", "off"],
      default: "off",
    },
    temperature: {
      type: Number,
      default: null,
    },
    voltage: {
      type: Number,
      default: null,
    },
    distance: {
      type: Number,
      default: 0,
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

const Telemetry = mongoose.model("Telemetry", telemetrySchema);

export default Telemetry;
