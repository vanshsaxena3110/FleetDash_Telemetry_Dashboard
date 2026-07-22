import Vehicle from "../models/Vehicle.js";
import Geofence from "../models/Geofence.js";
import Alert from "../models/Alert.js";

/**
 * @desc    Get aggregated dashboard summary metrics (Vehicles, Geofences, Alerts, Fleet Health)
 * @route   GET /api/dashboard/summary
 * @access  Private
 */
export const getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch vehicles, geofences, and alerts concurrently
    const [vehicles, geofences, alerts] = await Promise.all([
      Vehicle.find({ createdBy: userId }),
      Geofence.find({ createdBy: userId }),
      Alert.find({ createdBy: userId, isResolved: false })
        .sort({ createdAt: -1 })
        .populate("vehicle", "vehicleNumber driverName type")
        .populate("geofence", "name type"),
    ]);

    // 1. Vehicle Metrics
    const vStats = vehicles.reduce(
      (acc, v) => {
        acc[v.status] = (acc[v.status] || 0) + 1;
        const t = v.latestTelemetry || {};

        if (typeof t.speed === "number" && v.status !== "offline") {
          acc.totalSpeed += t.speed;
          acc.speedCount++;
        }
        if (typeof t.fuel === "number" && t.fuel !== null) {
          acc.totalFuel += t.fuel;
          acc.fuelCount++;
          if (t.fuel < 20) acc.lowFuelCount++;
        }
        if (typeof t.temperature === "number" && t.temperature > 90) {
          acc.highTempCount++;
        }
        if (v.status !== "offline" && !(t.fuel < 20) && !(t.temperature > 90)) {
          acc.healthyCount++;
        }
        return acc;
      },
      { moving: 0, idle: 0, offline: 0, totalSpeed: 0, speedCount: 0, totalFuel: 0, fuelCount: 0, lowFuelCount: 0, highTempCount: 0, healthyCount: 0 }
    );

    const totalVehicles = vehicles.length;
    const avgSpeed = vStats.speedCount ? Math.round((vStats.totalSpeed / vStats.speedCount) * 10) / 10 : 0;
    const avgFuel = vStats.fuelCount ? Math.round((vStats.totalFuel / vStats.fuelCount) * 10) / 10 : 0;
    const healthPercentage = totalVehicles ? Math.round((vStats.healthyCount / totalVehicles) * 100) : 100;
    const utilizationPercentage = totalVehicles ? Math.round(((vStats.moving + vStats.idle) / totalVehicles) * 100) : 0;

    // 2. Geofence Metrics
    const gStats = geofences.reduce(
      (acc, g) => {
        acc[g.status] = (acc[g.status] || 0) + 1;
        acc.totalInside += g.insideCount || 0;
        acc.totalOutside += g.outsideCount || 0;
        return acc;
      },
      { active: 0, warning: 0, inactive: 0, totalInside: 0, totalOutside: 0 }
    );

    // 3. Alert Metrics
    const aStats = alerts.reduce(
      (acc, a) => {
        acc[a.severity] = (acc[a.severity] || 0) + 1;
        return acc;
      },
      { critical: 0, warning: 0, info: 0 }
    );

    const recentAlerts = alerts.slice(0, 5).map((a) => ({
      id: a._id,
      title: a.title,
      desc: a.description,
      severity: a.severity,
      type: a.type,
      time: a.createdAt,
      vehicleNumber: a.vehicle ? a.vehicle.vehicleNumber : null,
      geofenceName: a.geofence ? a.geofence.name : null,
    }));

    // Response Data
    res.status(200).json({
      success: true,
      data: {
        vehicles: {
          total: totalVehicles,
          moving: vStats.moving,
          idle: vStats.idle,
          offline: vStats.offline,
          avgSpeed,
          avgFuel,
          lowFuelCount: vStats.lowFuelCount,
          highTempCount: vStats.highTempCount,
        },
        geofences: {
          total: geofences.length,
          active: gStats.active,
          warning: gStats.warning,
          inactive: gStats.inactive,
          totalInside: gStats.totalInside,
          totalOutside: gStats.totalOutside,
        },
        alerts: {
          totalUnresolved: alerts.length,
          critical: aStats.critical,
          warning: aStats.warning,
          info: aStats.info,
          recent: recentAlerts,
        },
        fleetHealth: {
          healthPercentage,
          utilizationPercentage,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving dashboard metrics",
      error: error.message,
    });
  }
};

/**
 * @desc    Get all recent alerts for dashboard
 * @route   GET /api/dashboard/alerts
 * @access  Private
 */
export const getRecentAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20)
      .populate("vehicle", "vehicleNumber driverName")
      .populate("geofence", "name");

    res.status(200).json({
      success: true,
      count: alerts.length,
      alerts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error retrieving recent alerts",
      error: error.message,
    });
  }
};
