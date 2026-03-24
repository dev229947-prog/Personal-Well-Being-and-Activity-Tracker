const express = require("express");
const { Op } = require("sequelize");
const { DailyTask, DailyCheckIn } = require("../models");
const router = express.Router();

/* ── GET all daily tasks for a user (with ALL check-ins) ── */
router.get("/:user_name", async (req, res) => {
  try {
    const tasks = await DailyTask.findAll({
      where: { user_name: req.params.user_name },
      include: [{
        model: DailyCheckIn,
        as: "checkins",
        required: false,
      }],
      order: [["createdAt", "DESC"]],
    });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POST create a new daily task ── */
router.post("/", async (req, res) => {
  try {
    const task = await DailyTask.create(req.body);
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── PUT update a daily task ── */
router.put("/:id", async (req, res) => {
  try {
    const task = await DailyTask.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    await task.update(req.body);
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── DELETE a daily task ── */
router.delete("/:id", async (req, res) => {
  try {
    const task = await DailyTask.findByPk(req.params.id);
    if (!task) return res.status(404).json({ error: "Task not found" });
    await task.destroy();
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POST check-in for a daily task (toggle / upsert) ── */
router.post("/:id/checkin", async (req, res) => {
  try {
    const { date, completed, actual_value } = req.body;
    const [checkin, created] = await DailyCheckIn.findOrCreate({
      where: { daily_task_id: req.params.id, date },
      defaults: { completed: completed ?? true, actual_value: actual_value ?? 0 },
    });
    if (!created) {
      await checkin.update({ completed: completed ?? !checkin.completed, actual_value: actual_value ?? checkin.actual_value });
    }
    res.json(checkin);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
