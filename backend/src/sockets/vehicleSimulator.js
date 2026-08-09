import Vehicle from "../models/Vehicle.js";
import { createTelemetryForVehicle } from "../controllers/telemetry.controller.js";
import Geofence from "../models/Geofence.js";
import Alert from "../models/Alert.js";
import { getIO } from "../sockets/socket.js";

let intervalId = null;

const SIMULATION_INTERVAL = 2000;

// Delhi area fallback
const DEFAULT_LAT = 28.6139;
const DEFAULT_LNG = 77.2090;

// Global safety bounds
const LAT_MIN = 27.0;
const LAT_MAX = 29.2;
const LNG_MIN = 76.5;
const LNG_MAX = 78.5;

// Keep vehicles near their starting location
const LOCAL_RADIUS = 0.08;

// Store heading for each vehicle
const headingByVehicle = new Map();

// Store original position for each vehicle
const originByVehicle = new Map();
// Geofence state: remembers whether each vehicle was inside/outside
const geofenceStateByVehicle = new Map();

const getDistanceKm = (lat1, lng1, lat2, lng2) => {
  const R = 6371;

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;

  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
};

const isVehicleInsideGeofence = (
  latitude,
  longitude,
  geofence
) => {
  // Circle geofence
  if (
    geofence.type === "circle" &&
    geofence.lat != null &&
    geofence.lng != null
  ) {
    const distance = getDistanceKm(
      latitude,
      longitude,
      Number(geofence.lat),
      Number(geofence.lng)
    );

    return distance * 1000 <= (geofence.radius || 0);
  }

  // Polygon geofence
  if (
    geofence.type === "polygon" &&
    Array.isArray(geofence.positions) &&
    geofence.positions.length >= 3
  ) {
    let inside = false;

    for (
      let i = 0, j = geofence.positions.length - 1;
      i < geofence.positions.length;
      j = i++
    ) {
      const pointI = geofence.positions[i];
      const pointJ = geofence.positions[j];

      const latI = Number(pointI[0]);
      const lngI = Number(pointI[1]);
      const latJ = Number(pointJ[0]);
      const lngJ = Number(pointJ[1]);

      const intersect =
        lngI > longitude !== lngJ > longitude &&
        latitude <
          ((latJ - latI) * (longitude - lngI)) /
            (lngJ - lngI) +
            latI;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  }

  return false;
};

// Geofence-friendly starting locations
const STARTING_PRESETS = [
  { latitude: 28.6304, longitude: 77.2177 },
  { latitude: 28.5562, longitude: 77.1000 },
  { latitude: 28.6500, longitude: 77.3000 },
  { latitude: 28.5800, longitude: 77.2300 },
  { latitude: 28.6800, longitude: 77.1500 },
];

const getRandomBetween = (min, max) => {
  return Math.random() * (max - min) + min;
};

const clamp = (value, min, max) => {
  return Math.max(min, Math.min(max, value));
};

// --------------------------------------------------
// STARTING LOCATION
// --------------------------------------------------

const getStartingLocation = (vehicle, index = 0) => {
  const latitude = vehicle.currentLocation?.latitude;
  const longitude = vehicle.currentLocation?.longitude;

  if (
    latitude != null &&
    longitude != null &&
    !isNaN(latitude) &&
    !isNaN(longitude)
  ) {
    return {
      latitude,
      longitude,
    };
  }

  const preset = STARTING_PRESETS[index % STARTING_PRESETS.length];

  return {
    latitude: preset.latitude + getRandomBetween(-0.003, 0.003),
    longitude: preset.longitude + getRandomBetween(-0.003, 0.003),
  };
};

// --------------------------------------------------
// HEADING
// --------------------------------------------------

const getInitialHeading = () => {
  return getRandomBetween(0, 360);
};

const getHeadingForVehicle = (vehicle) => {
  if (!vehicle?._id) {
    return 0;
  }

  const key = String(vehicle._id);

  if (!headingByVehicle.has(key)) {
    headingByVehicle.set(key, getInitialHeading());
  }

  return headingByVehicle.get(key);
};

const updateHeading = (vehicle) => {
  if (!vehicle?._id) {
    return 0;
  }

  const key = String(vehicle._id);

  const currentHeading = getHeadingForVehicle(vehicle);

  const headingChange = getRandomBetween(-5, 5);

  const nextHeading =
    (currentHeading + headingChange + 360) % 360;

  headingByVehicle.set(key, nextHeading);

  return nextHeading;
};

// --------------------------------------------------
// VEHICLE MOVEMENT
// --------------------------------------------------

const getNextLocation = (
  latitude,
  longitude,
  speed,
  vehicle
) => {
  // No movement
  if (speed <= 0) {
    return {
      latitude,
      longitude,
    };
  }

  const heading = updateHeading(vehicle);

  // Distance travelled in 2 seconds
  const distanceKm =
    (speed * SIMULATION_INTERVAL) / 3600000;

  const latitudeDelta =
    (distanceKm / 111) *
    Math.cos((heading * Math.PI) / 180);

  const longitudeDelta =
    (distanceKm /
      (111 *
        Math.max(
          0.1,
          Math.cos((latitude * Math.PI) / 180)
        ))) *
    Math.sin((heading * Math.PI) / 180);

  let newLatitude = latitude + latitudeDelta;
  let newLongitude = longitude + longitudeDelta;

  // Keep vehicle within local area
  const key = String(vehicle._id);

  if (!originByVehicle.has(key)) {
    originByVehicle.set(key, {
      latitude,
      longitude,
    });
  }

  const origin = originByVehicle.get(key);

  newLatitude = clamp(
    newLatitude,
    origin.latitude - LOCAL_RADIUS,
    origin.latitude + LOCAL_RADIUS
  );

  newLongitude = clamp(
    newLongitude,
    origin.longitude - LOCAL_RADIUS,
    origin.longitude + LOCAL_RADIUS
  );

  // Global safety bounds
  newLatitude = clamp(
    newLatitude,
    LAT_MIN,
    LAT_MAX
  );

  newLongitude = clamp(
    newLongitude,
    LNG_MIN,
    LNG_MAX
  );

  return {
    latitude: newLatitude,
    longitude: newLongitude,
  };
};

// --------------------------------------------------
// SPEED
// --------------------------------------------------

const getNextSpeed = (currentSpeed, currentStatus) => {
  // Keep offline vehicles offline
  if (currentStatus === "offline") {
    return 0;
  }

  // Keep idle vehicles idle
  if (currentStatus === "idle") {
    return 0;
  }

  // Moving vehicles remain moving
  if (currentStatus === "moving") {
    if (currentSpeed <= 0) {
      return 20;
    }

    const speedDelta = getRandomBetween(-8, 8);

    return Math.min(
      95,
      Math.max(
        1,
        currentSpeed + Math.round(speedDelta)
      )
    );
  }

  return 0;
};
// --------------------------------------------------
// TELEMETRY
// --------------------------------------------------

const normalizeTelemetry = (
  vehicle,
  nextSpeed
) => {
  const currentFuel =
    vehicle.latestTelemetry?.fuel ??
    getRandomBetween(60, 90);

  const currentTemp =
    vehicle.latestTelemetry?.temperature ??
    getRandomBetween(55, 75);

  const currentVoltage =
    vehicle.latestTelemetry?.voltage ??
    getRandomBetween(12.2, 13.2);

  const currentDistance =
    vehicle.latestTelemetry?.distance ?? 0;

  // Moving vehicles consume fuel slowly
  let nextFuel = currentFuel;

  if (nextSpeed > 0 && currentFuel > 0) {
    nextFuel =
      currentFuel -
      getRandomBetween(0.01, 0.03);
  }

  nextFuel = Math.max(
    0,
    Math.round(nextFuel * 10) / 10
  );

  // Temperature changes slowly
  const nextTemp =
    Math.round(
      (
        currentTemp +
        getRandomBetween(-0.5, 0.8)
      ) * 10
    ) / 10;

  // Voltage changes slightly
  const nextVoltage =
    Math.round(
      (
        currentVoltage +
        getRandomBetween(-0.02, 0.03)
      ) * 10
    ) / 10;

  // Distance increases only while moving
  const nextDistance =
    nextSpeed > 0
      ? Math.round(
        (
          currentDistance +
          (nextSpeed *
            SIMULATION_INTERVAL) /
          3600000
        ) * 100
      ) / 100
      : currentDistance;

  return {
    fuel: nextFuel,
    temperature: clamp(
      nextTemp,
      30,
      110
    ),
    voltage: clamp(
      nextVoltage,
      11.5,
      13.8
    ),
    distance: nextDistance,
  };
};


const checkVehicleGeofences = async (
  vehicle,
  latitude,
  longitude
) => {
  try {
    const geofences = await Geofence.find({
      createdBy: vehicle.createdBy,
    });

    if (!geofences.length) {
      return;
    }

    for (const geofence of geofences) {
      const currentlyInside = isVehicleInsideGeofence(
        latitude,
        longitude,
        geofence
      );

      const stateKey =
        `${vehicle._id}_${geofence._id}`;

      const previousState =
        geofenceStateByVehicle.get(stateKey);

      // First time: remember state, DON'T create alert
      if (previousState === undefined) {
        geofenceStateByVehicle.set(
          stateKey,
          currentlyInside
        );
        continue;
      }

      // No transition
      if (previousState === currentlyInside) {
        continue;
      }

      // Save new state
      geofenceStateByVehicle.set(
        stateKey,
        currentlyInside
      );

      const entered = currentlyInside;

      const alert = await Alert.create({
  title: entered
    ? "Vehicle Entered Geofence"
    : "Vehicle Exited Geofence",

  description: entered
    ? `Vehicle ${vehicle.vehicleNumber} entered ${geofence.name}`
    : `Vehicle ${vehicle.vehicleNumber} exited ${geofence.name}`,

  vehicle: vehicle._id,
  geofence: geofence._id,

  severity: "warning",
  type: "geofence",

  location: {
    latitude,
    longitude,
  },

  createdBy: vehicle.createdBy,
});
      try {
        getIO().emit(
          "new_alert",
          alert
        );
      } catch (socketError) {
        console.warn(
          "Geofence socket warning:",
          socketError.message
        );
      }

      console.log(
        `🚨 GEOFENCE ${
          entered ? "ENTER" : "EXIT"
        }: ${vehicle.vehicleNumber} → ${geofence.name}`
      );
    }
  } catch (error) {
    console.warn(
      "Geofence check failed:",
      error.message
    );
  }
};
// --------------------------------------------------
// MAIN SIMULATION
// --------------------------------------------------

export const startVehicleMovementSimulation = () => {
  if (intervalId) {
    return;
  }

  console.log(
    "🚚 Vehicle movement simulation started"
  );

  intervalId = setInterval(async () => {
    try {
      const vehicles = await Vehicle.find();

      if (!vehicles || vehicles.length === 0) {
        return;
      }

      await Promise.all(
        vehicles.map(
          async (vehicle, index) => {
            try {
              if (!vehicle?._id) {
                return;
              }

              const {
                latitude,
                longitude,
              } = getStartingLocation(
                vehicle,
                index
              );

              const currentSpeed =
                vehicle.latestTelemetry
                  ?.speed ?? 0;

              const currentFuel =
                vehicle.latestTelemetry
                  ?.fuel ?? 100;

              const currentStatus =
                vehicle.status;

              // Calculate speed according to status
              const nextSpeed =
                getNextSpeed(
                  currentSpeed,
                  currentStatus,
                  currentFuel
                );

              // Only MOVING vehicles change location
              const nextLocation =
                currentStatus === "moving" &&
                  nextSpeed > 0
                  ? getNextLocation(
                    latitude,
                    longitude,
                    nextSpeed,
                    vehicle
                  )
                  : {
                    latitude,
                    longitude,
                  };

              const telemetryValues =
                normalizeTelemetry(
                  vehicle,
                  nextSpeed
                );
                await checkVehicleGeofences(
                  vehicle,
  nextLocation.latitude,
  nextLocation.longitude
);

              // Fuel empty → stop vehicle
              const fuelEmpty =
                telemetryValues.fuel <= 0;

              const nextStatus = currentStatus;
              const nextEngineStatus =
                nextStatus === "moving"
                  ? "on"
                  : "off";

              await createTelemetryForVehicle({
                vehicle,

                latitude:
                  nextLocation.latitude,

                longitude:
                  nextLocation.longitude,

                speed: nextSpeed,

                fuel:
                  telemetryValues.fuel,

                engineStatus:
                  nextEngineStatus,

                temperature:
                  telemetryValues.temperature,

                voltage:
                  telemetryValues.voltage,

                distance:
                  telemetryValues.distance,

                createdBy:
                  vehicle.createdBy,

                overrideStatus:
                  nextStatus,

                emitAlerts: true,

                emitEvent: true,
              });
            } catch (simError) {
              console.warn(
                `Vehicle ${vehicle?._id || "unknown"
                } simulation error:`,
                simError.message
              );
            }
          }
        )
      );
    } catch (error) {
      console.error(
        "Vehicle movement simulation failed:",
        error.message
      );
    }
  }, 3000); //SIMULATION_INTERVAL
};

// --------------------------------------------------
// STOP SIMULATION
// --------------------------------------------------

export const stopVehicleMovementSimulation = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }

  headingByVehicle.clear();
  originByVehicle.clear();

  console.log(
    "🛑 Vehicle movement simulation stopped"
  );
};