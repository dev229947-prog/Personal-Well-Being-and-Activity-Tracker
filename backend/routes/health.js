const express = require("express");
const router = express.Router();
const { getCollections, ObjectId } = require("../models");

// POST /health/
router.post("/", async (req, res) => {
  try {
    const { user_name, metric_type, value, unit, date } = req.body;
    if (!user_name || !metric_type || value === undefined || !date) {
      return res.status(400).json({ detail: "user_name, metric_type, value, and date are required" });
    }
    const collections = await getCollections();
    const result = await collections.healthMetrics.insertOne({ user_name, metric_type, value, unit: unit || "", date, createdAt: new Date(), updatedAt: new Date() });
    return res.status(201).json({ _id: result.insertedId, user_name, metric_type, value, date });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /health/:user_name
router.get("/:user_name", async (req, res) => {
  try {
    const collections = await getCollections();
    const entries = await collections.healthMetrics.find({
      user_name: req.params.user_name,
    }).sort({ date: -1 }).toArray();
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /health/:user_name/:metric_type
router.get("/:user_name/:metric_type", async (req, res) => {
  try {
    const collections = await getCollections();
    const entries = await collections.healthMetrics.find({
      user_name: req.params.user_name, metric_type: req.params.metric_type,
    }).sort({ date: -1 }).toArray();
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// DELETE /health/:id
router.delete("/:id", async (req, res) => {
  try {
    const collections = await getCollections();
    const result = await collections.healthMetrics.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ detail: "Not found" });
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
