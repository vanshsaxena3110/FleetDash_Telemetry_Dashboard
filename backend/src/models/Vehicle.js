import mongoose from "mongoose";

const vehicleSchema = new mongoose.Schema(
  {
    vehicleNumber: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      uppercase: true,
    },

    driverName: {
      type: String,
      trim: true,
      default: "Not assigned",
    },

    driverContact: {
      type: String,
      trim: true,
      default: "",
    },

    type: {
      type: String,
      enum: ["truck", "van", "bike", "car"],
      default: "truck",
    },

    // Use frontend-friendly values directly
    status: {
      type: String,
      enum: ["moving", "idle", "offline"],
      default: "offline",
    },

    currentLocation: {
      latitude: {
        type: Number,
        default: null,
      },
      longitude: {
        type: Number,
        default: null,
      },
      updatedAt: {
        type: Date,
        default: null,
      },
    },

    // Latest telemetry only — updated with each GPS event
    latestTelemetry: {
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

const Vehicle = mongoose.model("Vehicle", vehicleSchema);

export default Vehicle;