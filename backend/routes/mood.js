const express = require("express");
const router = express.Router();
const { getCollections, ObjectId } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_name, date, mood_score, stress_level, energy_level, mindfulness_min, notes } = req.body;
    if (!user_name || !date || mood_score === undefined) {
      return res.status(400).json({ detail: "user_name, date, and mood_score are required" });
    }
    const collections = await getCollections();
    const result = await collections.moodLogs.insertOne({
      user_name, date, mood_score,
      stress_level: stress_level || 5, energy_level: energy_level || 5,
      mindfulness_min: mindfulness_min || 0, notes: notes || "", createdAt: new Date(), updatedAt: new Date(),
    });
    return res.status(201).json({ _id: result.insertedId, user_name, date, mood_score });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/:user_name", async (req, res) => {
  try {
    const collections = await getCollections();
    const entries = await collections.moodLogs.find({
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
    const result = await collections.moodLogs.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ detail: "Not found" });
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
