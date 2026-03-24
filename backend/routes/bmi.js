const express = require("express");
const router = express.Router();
const { WeightLog } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_name, date, weight_kg, height_cm, calories_in, calories_out, goal_type, target_weight, notes } = req.body;
    if (!user_name || !date || !weight_kg || !height_cm) {
      return res.status(400).json({ detail: "user_name, date, weight_kg, and height_cm are required" });
    }
    const heightM = height_cm / 100;
    const bmi = parseFloat((weight_kg / (heightM * heightM)).toFixed(1));
    const entry = await WeightLog.create({
      user_name, date, weight_kg, height_cm, bmi,
      calories_in: calories_in || 0,
      calories_out: calories_out || 0,
      goal_type: goal_type || "lose",
      target_weight: target_weight || null,
      notes: notes || "",
    });
    return res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/:user_name", async (req, res) => {
  try {
    const entries = await WeightLog.findAll({
      where: { user_name: req.params.user_name },
      order: [["date", "ASC"]],
    });
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const entry = await WeightLog.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    const { weight_kg, height_cm, calories_in, calories_out, goal_type, target_weight, notes } = req.body;
    const w = weight_kg !== undefined ? weight_kg : entry.weight_kg;
    const h = height_cm !== undefined ? height_cm : entry.height_cm;
    const heightM = h / 100;
    const bmi = parseFloat((w / (heightM * heightM)).toFixed(1));
    await entry.update({
      weight_kg: w, height_cm: h, bmi,
      calories_in: calories_in !== undefined ? calories_in : entry.calories_in,
      calories_out: calories_out !== undefined ? calories_out : entry.calories_out,
      goal_type: goal_type !== undefined ? goal_type : entry.goal_type,
      target_weight: target_weight !== undefined ? target_weight : entry.target_weight,
      notes: notes !== undefined ? notes : entry.notes,
    });
    return res.json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const entry = await WeightLog.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    await entry.destroy();
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
