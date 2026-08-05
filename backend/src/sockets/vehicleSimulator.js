import Vehicle from "../models/Vehicle.js";
import { createTelemetryForVehicle } from "../controllers/telemetry.controller.js";
import { getIO } from "./socket.js";

let intervalId = null;

const DEFAULT_LAT = 28.6139;
const DEFAULT_LNG = 77.2090;
const LAT_MIN = 27.0;
const LAT_MAX = 29.2;
const LNG_MIN = 76.5;
const LNG_MAX = 78.5;

const getRandomBetween = (min, max) => Math.random() * (max - min) + min;

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const headingByVehicle = new Map()

const getStartingLocation = (vehicle) => {
  const latitude = vehicle.currentLocation?.latitude;
  const longitude = vehicle.currentLocation?.longitude;
  if (latitude != null && longitude != null) {
    return { latitude, longitude };
  }

  return {
    latitude: DEFAULT_LAT + getRandomBetween(-0.03, 0.03),
    longitude: DEFAULT_LNG + getRandomBetween(-0.03, 0.03),
  };
};

const getInitialHeading = () => getRandomBetween(0, 360)

const getHeadingForVehicle = (vehicle) => {
  const key = String(vehicle._id)
  if (!headingByVehicle.has(key)) {
    headingByVehicle.set(key, getInitialHeading())
  }
  return headingByVehicle.get(key)
}

const updateHeading = (vehicle) => {
  const key = String(vehicle._id)
  const currentHeading = getHeadingForVehicle(vehicle)
  const headingChange = getRandomBetween(-5, 5)
  const nextHeading = (currentHeading + headingChange + 360) % 360
  headingByVehicle.set(key, nextHeading)
  return nextHeading
}

const getNextLocation = (latitude, longitude, speed, vehicle) => {
  if (speed <= 0) {
    return { latitude, longitude }
  }

  const heading = updateHeading(vehicle)
  const distanceKm = (speed * 2) / 3600
  const latitudeDelta = (distanceKm / 111) * Math.cos((heading * Math.PI) / 180)
  const longitudeDelta = (distanceKm / (111 * Math.max(0.1, Math.cos(latitude * Math.PI / 180)))) * Math.sin((heading * Math.PI) / 180)

  const newLatitude = clamp(latitude + latitudeDelta, LAT_MIN, LAT_MAX)
  const newLongitude = clamp(longitude + longitudeDelta, LNG_MIN, LNG_MAX)
  return { latitude: newLatitude, longitude: newLongitude };
};

const getNextSpeed = (currentSpeed, currentStatus) => {
  if (currentSpeed === 0) {
    return Math.round(getRandomBetween(20, 45));
  }

  const speedDelta = getRandomBetween(-8, 8);
  let nextSpeed = Math.max(0, currentSpeed + Math.round(speedDelta));

  if (currentStatus === "offline" && nextSpeed < 8) {
    nextSpeed = 0;
  }

  if (nextSpeed > 95) {
    nextSpeed = 95;
  }

  return nextSpeed;
};

const normalizeTelemetry = (vehicle, nextSpeed) => {
  const currentFuel = vehicle.latestTelemetry?.fuel ?? getRandomBetween(45, 90);
  const currentTemp = vehicle.latestTelemetry?.temperature ?? getRandomBetween(40, 75);
  const currentVoltage = vehicle.latestTelemetry?.voltage ?? getRandomBetween(12.0, 13.2);
  const currentDistance = vehicle.latestTelemetry?.distance ?? 0;

  const nextFuel = Math.max(0, Math.round((currentFuel - (nextSpeed > 0 ? getRandomBetween(0.1, 0.25) : 0.02)) * 10) / 10);
  const nextTemp = Math.round((currentTemp + getRandomBetween(-1.2, 1.8)) * 10) / 10;
  const nextVoltage = Math.round((currentVoltage + getRandomBetween(-0.05, 0.08)) * 10) / 10;
  const nextDistance = Math.round((currentDistance + (nextSpeed * 2) / 3600) * 100) / 100;

  return {
    fuel: nextFuel,
    temperature: clamp(nextTemp, 30, 110),
    voltage: clamp(nextVoltage, 11.5, 13.8),
    distance: nextDistance,
  };
};

const isStatusOffline = (vehicle, nextSpeed) => {
  if (vehicle.status === "offline") {
    return nextSpeed === 0;
  }
  return false;
};

export const startVehicleMovementSimulation = () => {
  if (intervalId) {
    return;
  }

  intervalId = setInterval(async () => {
    try {
      const vehicles = await Vehicle.find();
      if (!vehicles.length) {
        return;
      }

      await Promise.all(
        vehicles.map(async (vehicle) => {
          try {
            const { latitude, longitude } = getStartingLocation(vehicle);
            const currentSpeed = vehicle.latestTelemetry?.speed ?? 0;
            const nextSpeed = getNextSpeed(currentSpeed, vehicle.status);
            const nextLocation = getNextLocation(latitude, longitude, nextSpeed);
            const telemetryValues = normalizeTelemetry(vehicle, nextSpeed);
            const nextEngineStatus = nextSpeed > 0 ? "on" : "off";
            const nextStatus = nextSpeed > 0 ? "moving" : isStatusOffline(vehicle, nextSpeed) ? "offline" : "idle";

            await createTelemetryForVehicle({
              vehicle,
              latitude: nextLocation.latitude,
              longitude: nextLocation.longitude,
              speed: nextSpeed,
              fuel: telemetryValues.fuel,
              engineStatus: nextEngineStatus,
              temperature: telemetryValues.temperature,
              voltage: telemetryValues.voltage,
              distance: telemetryValues.distance,
              createdBy: vehicle.createdBy,
              overrideStatus: nextStatus,
              emitAlerts: true,
              emitEvent: true,
            });
          } catch (simError) {
            console.warn("Vehicle simulation error:", simError.message);
          }
        })
      );
    } catch (error) {
      console.error("Vehicle movement simulation failed:", error.message);
    }
  }, 2000);
};

export const stopVehicleMovementSimulation = () => {
  if (intervalId) {
    clearInterval(intervalId);
    intervalId = null;
  }
};
