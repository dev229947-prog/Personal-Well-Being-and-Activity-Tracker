const express = require("express");
const router = express.Router();
const { MoodLog } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_name, date, mood_score, stress_level, energy_level, mindfulness_min, notes } = req.body;
    if (!user_name || !date || mood_score === undefined) {
      return res.status(400).json({ detail: "user_name, date, and mood_score are required" });
    }
    const entry = await MoodLog.create({
      user_name, date, mood_score,
      stress_level: stress_level || 5, energy_level: energy_level || 5,
      mindfulness_min: mindfulness_min || 0, notes: notes || "",
    });
    return res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/:user_name", async (req, res) => {
  try {
    const entries = await MoodLog.findAll({
      where: { user_name: req.params.user_name },
      order: [["date", "DESC"]],
    });
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const entry = await MoodLog.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    await entry.destroy();
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
