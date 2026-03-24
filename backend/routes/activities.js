const express = require("express");
const router = express.Router();
const { getCollections, ObjectId } = require("../models");

// POST /activities/
router.post("/", async (req, res) => {
  try {
    const { user_name, activity_type, value } = req.body;

    if (!user_name || !activity_type || value === undefined) {
      return res.status(400).json({ detail: "user_name, activity_type and value are required" });
    }

    const collections = await getCollections();
    const result = await collections.activities.insertOne({ user_name, activity_type, value, timestamp: new Date() });
    return res.status(201).json({ _id: result.insertedId, user_name, activity_type, value });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /activities/:user_name
router.get("/:user_name", async (req, res) => {
  try {
    const { user_name } = req.params;
    const collections = await getCollections();
    const activities = await collections.activities.find({
      user_name,
    }).sort({ timestamp: -1 }).toArray();
    return res.json(activities);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
