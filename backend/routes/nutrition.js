const express = require("express");
const router = express.Router();
const { getCollections, ObjectId } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_name, date, meal_type, description, calories, protein_g, carbs_g, fat_g, water_ml } = req.body;
    if (!user_name || !date || !meal_type) {
      return res.status(400).json({ detail: "user_name, date, and meal_type are required" });
    }
    const collections = await getCollections();
    const result = await collections.nutritionLogs.insertOne({
      user_name, date, meal_type, description: description || "",
      calories: calories || 0, protein_g: protein_g || 0,
      carbs_g: carbs_g || 0, fat_g: fat_g || 0, water_ml: water_ml || 0, createdAt: new Date(), updatedAt: new Date(),
    });
    return res.status(201).json({ _id: result.insertedId, user_name, date, meal_type });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/:user_name", async (req, res) => {
  try {
    const collections = await getCollections();
    const entries = await collections.nutritionLogs.find({
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
    const result = await collections.nutritionLogs.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ detail: "Not found" });
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
