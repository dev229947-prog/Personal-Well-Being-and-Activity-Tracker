const express = require("express");
const router = express.Router();
const { getCollections, ObjectId } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_name, date, exercise_type, exercise_name, duration_min, sets, reps, calories_burned, notes } = req.body;
    if (!user_name || !date || !exercise_type || !exercise_name) {
      return res.status(400).json({ detail: "user_name, date, exercise_type, and exercise_name are required" });
    }
    const collections = await getCollections();
    const result = await collections.workoutLogs.insertOne({
      user_name, date, exercise_type, exercise_name,
      duration_min: duration_min || 0, sets: sets || 0, reps: reps || 0,
      calories_burned: calories_burned || 0, notes: notes || "", createdAt: new Date(), updatedAt: new Date(),
    });
    return res.status(201).json({ _id: result.insertedId, user_name, date, exercise_type, exercise_name });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/:user_name", async (req, res) => {
  try {
    const collections = await getCollections();
    const entries = await collections.workoutLogs.find({
      user_name: req.params.user_name,
    }).sort({ date: -1 }).toArray();
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const collections = await getCollections();
    const result = await collections.workoutLogs.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ detail: "Not found" });
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
