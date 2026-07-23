import Alert from "../models/Alert.js";

// GET /api/alert/get
export const getAlerts = async (req, res) => {
  try {
    const alerts = await Alert.find({ createdBy: req.user._id })
      .sort({ createdAt: -1 })
      .populate("vehicle", "vehicleNumber driverName")
      .populate("geofence", "name");
    res.json({ count: alerts.length, alerts });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// POST /api/alert/create
export const createAlert = async (req, res) => {
  try {
    const alert = await Alert.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json({ message: "Alert created", alert });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PATCH /api/alert/resolve/:id
export const resolveAlert = async (req, res) => {
  try {
    const alert = await Alert.findOneAndUpdate(
      { _id: req.params.id, createdBy: req.user._id },
      { isResolved: true },
      { new: true }
    );
    res.json({ message: "Alert resolved", alert });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/alert/delete/:id
export const deleteAlert = async (req, res) => {
  try {
    await Alert.findOneAndDelete({ _id: req.params.id, createdBy: req.user._id });
    res.json({ message: "Alert deleted" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// DELETE /api/alert/clear-resolved
export const clearResolvedAlerts = async (req, res) => {
  try {
    const result = await Alert.deleteMany({ createdBy: req.user._id, isResolved: true });
    res.json({ message: "Resolved alerts cleared", count: result.deletedCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
