const express = require("express");
const router = express.Router();
const { SleepLog } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_name, date, hours, quality, rem_hours, deep_hours, light_hours, notes } = req.body;
    if (!user_name || !date || hours === undefined) {
      return res.status(400).json({ detail: "user_name, date, and hours are required" });
    }
    const entry = await SleepLog.create({
      user_name, date, hours, quality: quality || 3,
      rem_hours: rem_hours || 0, deep_hours: deep_hours || 0, light_hours: light_hours || 0,
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
    const entries = await SleepLog.findAll({
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
    const entry = await SleepLog.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    await entry.destroy();
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
