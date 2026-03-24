const express = require("express");
const router = express.Router();
const { HealthRecord } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_name, record_type, title, description, date, time, recurring } = req.body;
    if (!user_name || !record_type || !title) {
      return res.status(400).json({ detail: "user_name, record_type, and title are required" });
    }
    const entry = await HealthRecord.create({
      user_name, record_type, title, description: description || "",
      date: date || null, time: time || "", recurring: recurring || false,
      status: "active",
    });
    return res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/:user_name", async (req, res) => {
  try {
    const entries = await HealthRecord.findAll({
      where: { user_name: req.params.user_name },
      order: [["date", "DESC"]],
    });
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const entry = await HealthRecord.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    const { record_type, title, description, date, time, recurring, status } = req.body;
    await entry.update({
      record_type: record_type !== undefined ? record_type : entry.record_type,
      title: title !== undefined ? title : entry.title,
      description: description !== undefined ? description : entry.description,
      date: date !== undefined ? date : entry.date,
      time: time !== undefined ? time : entry.time,
      recurring: recurring !== undefined ? recurring : entry.recurring,
      status: status !== undefined ? status : entry.status,
    });
    return res.json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const entry = await HealthRecord.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    await entry.destroy();
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
