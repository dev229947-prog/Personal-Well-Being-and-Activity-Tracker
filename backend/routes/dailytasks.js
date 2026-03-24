const express = require("express");
const { getCollections, ObjectId } = require("../models");
const router = express.Router();

/* ── GET all daily tasks for a user (with ALL check-ins) ── */
router.get("/:user_name", async (req, res) => {
  try {
    const collections = await getCollections();
    const tasks = await collections.dailyTasks.find({
      user_name: req.params.user_name,
    }).sort({ createdAt: -1 }).toArray();
    
    // Fetch check-ins for each task
    for (let task of tasks) {
      task.checkins = await collections.dailyCheckIns.find({
        daily_task_id: task._id.toString(),
      }).toArray();
    }
    
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POST create a new daily task ── */
router.post("/", async (req, res) => {
  try {
    const collections = await getCollections();
    const task = await collections.dailyTasks.insertOne({ ...req.body, createdAt: new Date(), updatedAt: new Date() });
    res.status(201).json({ _id: task.insertedId, ...req.body });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── PUT update a daily task ── */
router.put("/:id", async (req, res) => {
  try {
    const collections = await getCollections();
    const task = await collections.dailyTasks.findOne({ _id: new ObjectId(req.params.id) });
    if (!task) return res.status(404).json({ error: "Task not found" });
    const updates = { ...req.body, updatedAt: new Date() };
    await collections.dailyTasks.updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });
    res.json({ _id: task._id, ...updates });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── DELETE a daily task ── */
router.delete("/:id", async (req, res) => {
  try {
    const collections = await getCollections();
    const task = await collections.dailyTasks.findOne({ _id: new ObjectId(req.params.id) });
    if (!task) return res.status(404).json({ error: "Task not found" });
    await collections.dailyTasks.deleteOne({ _id: new ObjectId(req.params.id) });
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ── POST check-in for a daily task (toggle / upsert) ── */
router.post("/:id/checkin", async (req, res) => {
  try {
    const { date, completed, actual_value } = req.body;
    const collections = await getCollections();
    const filter = { daily_task_id: req.params.id, date };
    const existing = await collections.dailyCheckIns.findOne(filter);
    
    if (existing) {
      const updates = { 
        completed: completed !== undefined ? completed : !existing.completed, 
        actual_value: actual_value !== undefined ? actual_value : existing.actual_value,
        updatedAt: new Date(),
      };
      await collections.dailyCheckIns.updateOne(filter, { $set: updates });
      res.json({ _id: existing._id, ...filter, ...updates });
    } else {
      const result = await collections.dailyCheckIns.insertOne({ 
        ...filter, 
        completed: completed ?? true, 
        actual_value: actual_value ?? 0,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      res.json({ _id: result.insertedId, ...filter, completed: completed ?? true, actual_value: actual_value ?? 0 });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
