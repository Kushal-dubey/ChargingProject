const express = require("express");
const router = express.Router();
const ChargingStation = require("../models/ChargingStation");
const authMiddleware = require("../middleware/authMiddleware");

//  Add Station (protected)
router.post("/add", authMiddleware, async (req, res) => {
  const { name, location, status, powerOutput, connectorType } = req.body;
  try {
    const station = new ChargingStation({
      name,
      location,
      status,
      powerOutput,
      connectorType,
      createdBy: req.user.id,
    });

    await station.save();

    // 🔄 Emit to socket after successful save
    const io = req.app.get("socketio");
    io.emit("new-station", station);

    res.status(201).json({ msg: "Charging station added", station });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

//  Update Charging Station (Protected)
router.put("/update/:id", authMiddleware, async (req, res) => {
  try {
    const station = await ChargingStation.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!station) return res.status(404).json({ msg: "Station not found" });

    // 🔄 Emit update event
    const io = req.app.get("socketio");
    io.emit("station-updated", station);

    res.json({ msg: "Station updated", station });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

//  Delete Charging Station (Protected)
router.delete("/delete/:id", authMiddleware, async (req, res) => {
  try {
    const station = await ChargingStation.findByIdAndDelete(req.params.id);
    if (!station) return res.status(404).json({ msg: "Station not found" });
   // ✅ Emit delete event
       const io = req.app.get("socketio");
       io.emit("station-deleted", req.params.id);
    res.json({ msg: "Station deleted" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

//  Get all stations (public)
router.get("/", async (req, res) => {
  try {
    const stations = await ChargingStation.find();
    res.json(stations);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

module.exports = router;
