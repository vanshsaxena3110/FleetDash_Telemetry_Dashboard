import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Circle,
  Polygon,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";

// Helper map controller to auto-adjust dimensions on mount
function MapResizeController() {
  const map = useMap();

  React.useEffect(() => {
    const timer = setTimeout(() => {
      map.invalidateSize();
    }, 200);

    return () => clearTimeout(timer);
  }, [map]);

  return null;
}

// Custom vehicle marker icon
const customTruckIcon = (color, label) => {
  const colorMap = {
    green:
      "bg-emerald-500 text-white ring-emerald-500/20",
    yellow:
      "bg-yellow-500 text-white ring-yellow-500/20",
    red:
      "bg-rose-500 text-white ring-rose-500/20",
    slate:
      "bg-slate-500 text-white ring-slate-500/20",
  };

  const colorClass =
    colorMap[color] ||
    "bg-slate-400 text-white";

  const dotColor =
    color === "green"
      ? "bg-emerald-500"
      : color === "yellow"
      ? "bg-yellow-500"
      : "bg-rose-500";

  return L.divIcon({
    html: `
      <div
        class="flex flex-col items-center justify-center select-none"
        style="transform: translate(-10px, -24px);"
      >
        <div
          class="bg-slate-900 text-white text-[8px] font-black px-1 py-0.5 rounded shadow-sm border border-slate-700/80 mb-0.5 whitespace-nowrap"
        >
          ${label}
        </div>

        <div
          class="rounded-lg border border-white p-1 shadow-md flex items-center justify-center ${colorClass}"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
            <circle cx="7" cy="17" r="2" />
            <path d="M9 17h6" />
            <circle cx="17" cy="17" r="2" />
          </svg>
        </div>

        <div
          class="h-2 w-2 rounded-full border border-white shadow-sm -mt-0.5 ${dotColor}"
        ></div>
      </div>
    `,

    className:
      "custom-leaflet-vehicle-marker",

    iconSize: [40, 48],
    iconAnchor: [20, 48],
  });
};

export default function GeofenceMap({
  geofences = [],
  vehicles = [],
  onSelectGeofence,
  selectedGeofenceId,
  isDarkMode = false,
}) {
  // Center between Mathura and Agra NH-19
  const position = [27.35, 77.85];

  return (
    <div
      className="h-[480px] rounded-lg border border-slate-200 overflow-hidden relative"
      style={{ zIndex: 1 }}
    >
      {/* Leaflet CSS overrides */}
      <style>
        {`
          .leaflet-container img {
            max-width: none !important;
            max-height: none !important;
          }

          .leaflet-div-icon {
            background: transparent !important;
            border: none !important;
          }

          .geofence-tooltip-label {
            background: rgba(255, 255, 255, 0.95) !important;
            border: 1px solid #10b981 !important;
            color: #065f46 !important;
            font-weight: 900 !important;
            font-size: 8px !important;
            padding: 2px 6px !important;
            border-radius: 4px !important;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
          }
        `}
      </style>

      <MapContainer
        center={position}
        zoom={10}
        className="h-full w-full"
      >
        <MapResizeController />

        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />

        {/* ================================
            GEOFENCES
        ================================= */}
        {geofences.map((g) => {
          const geofenceId =
            g.id || g._id;

          const isSelected =
            String(selectedGeofenceId) ===
            String(geofenceId);

          const pathOptions = {
            color: isSelected
              ? "#059669"
              : "#10b981",

            fillColor: "#10b981",

            fillOpacity: isSelected
              ? 0.22
              : 0.12,

            weight: isSelected
              ? 3
              : 2,

            dashArray:
              g.type === "polygon"
                ? "3, 3"
                : null,
          };

          // Circle geofence
          if (
            g.type === "circle" &&
            g.lat != null &&
            g.lng != null
          ) {
            return (
              <Circle
                key={String(geofenceId)}
                center={[
                  Number(g.lat),
                  Number(g.lng),
                ]}
                radius={
                  Number(g.radius) || 2800
                }
                pathOptions={pathOptions}
                eventHandlers={{
                  click: () =>
                    onSelectGeofence &&
                    onSelectGeofence(g),
                }}
              >
                <Tooltip
                  permanent
                  direction="center"
                  className="geofence-tooltip-label"
                >
                  {g.name}
                </Tooltip>
              </Circle>
            );
          }

          // Polygon geofence
          if (
            g.type === "polygon" &&
            Array.isArray(g.positions)
          ) {
            return (
              <Polygon
                key={String(geofenceId)}
                positions={g.positions}
                pathOptions={pathOptions}
                eventHandlers={{
                  click: () =>
                    onSelectGeofence &&
                    onSelectGeofence(g),
                }}
              >
                <Tooltip
                  permanent
                  direction="center"
                  className="geofence-tooltip-label"
                >
                  {g.name}
                </Tooltip>
              </Polygon>
            );
          }

          return null;
        })}

        {/* ================================
            REAL VEHICLE MARKERS
            Moving + Idle + Offline
        ================================= */}
        {vehicles
          .filter((vehicle) => {
            if (!vehicle) {
              return false;
            }

            const lat =
              vehicle.lat ??
              vehicle.currentLocation?.latitude;

            const lng =
              vehicle.lng ??
              vehicle.currentLocation?.longitude;

            return (
              lat != null &&
              lng != null &&
              !Number.isNaN(Number(lat)) &&
              !Number.isNaN(Number(lng))
            );
          })
          .map((vehicle) => {
            const vehicleId =
              vehicle.vehicleNumber ||
              vehicle.registrationNumber ||
              vehicle.id ||
              vehicle._id ||
              "Unknown Vehicle";

            const status =
              vehicle.status ||
              "offline";

            // Status → marker color
            let markerColor = "red";

            if (status === "moving") {
              markerColor = "green";
            } else if (status === "idle") {
              markerColor = "yellow";
            } else if (
              status === "offline"
            ) {
              markerColor = "red";
            }

            const latitude =
              Number(
                vehicle.lat ??
                  vehicle.currentLocation
                    ?.latitude
              );

            const longitude =
              Number(
                vehicle.lng ??
                  vehicle.currentLocation
                    ?.longitude
              );

            const speed =
              vehicle.latestTelemetry
                ?.speed ??
              vehicle.speed ??
              0;

            const driver =
              vehicle.driverName ||
              vehicle.driver ||
              "Unknown Driver";

            return (
              <Marker
                key={String(
                  vehicle.id ||
                    vehicle._id ||
                    vehicleId
                )}
                position={[
                  latitude,
                  longitude,
                ]}
                icon={customTruckIcon(
                  markerColor,
                  vehicleId
                )}
              >
                <Popup>
                  <div className="text-left font-sans text-xs leading-normal">
                    <p className="font-extrabold text-emerald-800">
                      {vehicleId}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Driver: {driver}
                    </p>

                    <p className="text-[10px] text-slate-500">
                      Speed: {speed} km/h
                    </p>

                    <p className="text-[10px] mt-1 font-bold">
                      Status:{" "}
                      <span
                        className={
                          status === "moving"
                            ? "text-emerald-600"
                            : status === "idle"
                            ? "text-yellow-600"
                            : "text-rose-600"
                        }
                      >
                        {status}
                      </span>
                    </p>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
}