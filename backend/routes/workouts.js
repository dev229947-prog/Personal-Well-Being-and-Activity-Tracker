const express = require("express");
const router = express.Router();
const { WorkoutLog } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_name, date, exercise_type, exercise_name, duration_min, sets, reps, calories_burned, notes } = req.body;
    if (!user_name || !date || !exercise_type || !exercise_name) {
      return res.status(400).json({ detail: "user_name, date, exercise_type, and exercise_name are required" });
    }
    const entry = await WorkoutLog.create({
      user_name, date, exercise_type, exercise_name,
      duration_min: duration_min || 0, sets: sets || 0, reps: reps || 0,
      calories_burned: calories_burned || 0, notes: notes || "",
    });
    return res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/:user_name", async (req, res) => {
  try {
    const entries = await WorkoutLog.findAll({
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
    const entry = await WorkoutLog.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    await entry.destroy();
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
