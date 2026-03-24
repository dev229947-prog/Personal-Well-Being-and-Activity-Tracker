const express = require("express");
const router = express.Router();
const { Activity } = require("../models");

// POST /activities/
router.post("/", async (req, res) => {
  try {
    const { user_name, activity_type, value } = req.body;

    if (!user_name || !activity_type || value === undefined) {
      return res.status(400).json({ detail: "user_name, activity_type and value are required" });
    }

    const activity = await Activity.create({ user_name, activity_type, value });
    return res.status(201).json(activity);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /activities/:user_name
router.get("/:user_name", async (req, res) => {
  try {
    const { user_name } = req.params;
    const activities = await Activity.findAll({
      where: { user_name },
      order: [["timestamp", "DESC"]],
    });
    return res.json(activities);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
