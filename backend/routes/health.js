const express = require("express");
const router = express.Router();
const { HealthMetric } = require("../models");
const { Op } = require("sequelize");

// POST /health/
router.post("/", async (req, res) => {
  try {
    const { user_name, metric_type, value, unit, date } = req.body;
    if (!user_name || !metric_type || value === undefined || !date) {
      return res.status(400).json({ detail: "user_name, metric_type, value, and date are required" });
    }
    const entry = await HealthMetric.create({ user_name, metric_type, value, unit: unit || "", date });
    return res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /health/:user_name
router.get("/:user_name", async (req, res) => {
  try {
    const entries = await HealthMetric.findAll({
      where: { user_name: req.params.user_name },
      order: [["date", "DESC"]],
    });
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /health/:user_name/:metric_type
router.get("/:user_name/:metric_type", async (req, res) => {
  try {
    const entries = await HealthMetric.findAll({
      where: { user_name: req.params.user_name, metric_type: req.params.metric_type },
      order: [["date", "DESC"]],
    });
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// DELETE /health/:id
router.delete("/:id", async (req, res) => {
  try {
    const entry = await HealthMetric.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    await entry.destroy();
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
