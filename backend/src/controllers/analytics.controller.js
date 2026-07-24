import Vehicle from "../models/Vehicle.js";
import Alert from "../models/Alert.js";

// @desc    Get general analytics summary
// @route   GET /api/analytics/summary
// @access  Private
export const getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Vehicle counts and metrics
    const vehicles = await Vehicle.find({ createdBy: userId });
    const totalVehicles = vehicles.length;
    let activeVehicles = 0;
    let idleVehicles = 0;
    let offlineVehicles = 0;
    let totalSpeed = 0;
    let speedCount = 0;
    let totalDistance = 0;

    vehicles.forEach((v) => {
      if (v.status === "moving") activeVehicles++;
      else if (v.status === "idle") idleVehicles++;
      else offlineVehicles++;

      if (v.latestTelemetry?.speed != null) {
        totalSpeed += v.latestTelemetry.speed;
        speedCount++;
      }
      if (v.latestTelemetry?.distance != null) {
        totalDistance += v.latestTelemetry.distance;
      }
    });

    const avgSpeed = speedCount > 0 ? Math.round(totalSpeed / speedCount) : 0;
    const movingPct = totalVehicles > 0 ? Math.round((activeVehicles / totalVehicles) * 100) : 0;
    const idlePct = totalVehicles > 0 ? Math.round((idleVehicles / totalVehicles) * 100) : 0;
    const offlinePct = totalVehicles > 0 ? Math.round((offlineVehicles / totalVehicles) * 100) : 0;

    // 2. Alert counts
    const totalAlerts = await Alert.countDocuments({ createdBy: userId });

    res.status(200).json({
      success: true,
      summary: {
        totalVehicles,
        activeVehicles,
        idleVehicles,
        offlineVehicles,
        movingPct,
        idlePct,
        offlinePct,
        avgSpeed,
        totalDistance,
        totalAlerts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch analytics summary",
    });
  }
};

// @desc    Get fleet distribution & performance breakdown
// @route   GET /api/analytics/performance
// @access  Private
export const getFleetPerformance = async (req, res) => {
  try {
    const userId = req.user._id;

    // Type distribution
    const vehicles = await Vehicle.find({ createdBy: userId });
    const typeDistribution = { truck: 0, van: 0, bike: 0, car: 0 };

    vehicles.forEach((v) => {
      if (typeDistribution[v.type] !== undefined) {
        typeDistribution[v.type]++;
      }
    });

    // Alert severity breakdown
    const alerts = await Alert.find({ createdBy: userId });
    const alertBreakdown = { critical: 0, warning: 0, info: 0 };

    alerts.forEach((a) => {
      if (alertBreakdown[a.severity] !== undefined) {
        alertBreakdown[a.severity]++;
      }
    });

    res.status(200).json({
      success: true,
      performance: {
        typeDistribution,
        alertBreakdown,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch fleet performance data",
    });
  }
};

// @desc    Get top vehicles by distance/activity
// @route   GET /api/analytics/top-vehicles
// @access  Private
export const getTopVehicles = async (req, res) => {
  try {
    const userId = req.user._id;

    const vehicles = await Vehicle.find({ createdBy: userId })
      .sort({ "latestTelemetry.distance": -1, updatedAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      vehicles,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to fetch top vehicles",
    });
  }
};
