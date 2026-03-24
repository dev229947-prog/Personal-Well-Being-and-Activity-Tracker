const express = require("express");
const router = express.Router();
const { getCollections, ObjectId } = require("../models");

// POST /schedule/bulk — Bulk create schedule entries (for templates)
router.post("/bulk", async (req, res) => {
  try {
    const { user_name, entries } = req.body;
    if (!user_name || !Array.isArray(entries) || entries.length === 0) {
      return res.status(400).json({ detail: "user_name and entries[] are required" });
    }
    const rows = entries.map(e => ({
      user_name,
      title: e.title,
      activity_type: e.activity_type,
      day_of_week: e.day_of_week,
      start_time: e.start_time,
      end_time: e.end_time,
      color: e.color || "#6366f1",
      notes: e.notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
    const collections = await getCollections();
    const result = await collections.scheduleEntries.insertMany(rows);
    return res.status(201).json({ insertedIds: result.insertedIds });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// DELETE /schedule/all/:user_name — Delete all entries for a user (for template reset)
router.delete("/all/:user_name", async (req, res) => {
  try {
    const collections = await getCollections();
    const result = await collections.scheduleEntries.deleteMany({ user_name: req.params.user_name });
    return res.json({ detail: `Deleted ${result.deletedCount} entries` });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// POST /schedule/ — Create a new schedule entry
router.post("/", async (req, res) => {
  try {
    const { user_name, title, activity_type, day_of_week, start_time, end_time, color, notes } = req.body;

    if (!user_name || !title || !activity_type || day_of_week === undefined || !start_time || !end_time) {
      return res.status(400).json({ detail: "user_name, title, activity_type, day_of_week, start_time, and end_time are required" });
    }

    if (day_of_week < 0 || day_of_week > 6) {
      return res.status(400).json({ detail: "day_of_week must be between 0 (Monday) and 6 (Sunday)" });
    }

    const collections = await getCollections();
    const result = await collections.scheduleEntries.insertOne({
      user_name,
      title,
      activity_type,
      day_of_week,
      start_time,
      end_time,
      color: color || "#6366f1",
      notes: notes || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.status(201).json({ _id: result.insertedId, user_name, title, activity_type, day_of_week, start_time, end_time });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /schedule/:user_name — Get all schedule entries for a user
router.get("/:user_name", async (req, res) => {
  try {
    const { user_name } = req.params;
    const collections = await getCollections();
    const entries = await collections.scheduleEntries.find({
      user_name,
    }).sort({ day_of_week: 1, start_time: 1 }).toArray();
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// PUT /schedule/:id — Update a schedule entry
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const collections = await getCollections();
    const entry = await collections.scheduleEntries.findOne({ _id: new ObjectId(id) });

    if (!entry) {
      return res.status(404).json({ detail: "Schedule entry not found" });
    }

    const { title, activity_type, day_of_week, start_time, end_time, color, notes } = req.body;

    if (day_of_week !== undefined && (day_of_week < 0 || day_of_week > 6)) {
      return res.status(400).json({ detail: "day_of_week must be between 0 (Monday) and 6 (Sunday)" });
    }

    const updates = {
      title: title !== undefined ? title : entry.title,
      activity_type: activity_type !== undefined ? activity_type : entry.activity_type,
      day_of_week: day_of_week !== undefined ? day_of_week : entry.day_of_week,
      start_time: start_time !== undefined ? start_time : entry.start_time,
      end_time: end_time !== undefined ? end_time : entry.end_time,
      color: color !== undefined ? color : entry.color,
      notes: notes !== undefined ? notes : entry.notes,
      updatedAt: new Date(),
    };

    await collections.scheduleEntries.updateOne({ _id: new ObjectId(id) }, { $set: updates });
    return res.json({ _id: entry._id, ...updates });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// DELETE /schedule/:id — Delete a schedule entry
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const collections = await getCollections();
    const result = await collections.scheduleEntries.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return res.status(404).json({ detail: "Schedule entry not found" });
    }

    return res.json({ detail: "Schedule entry deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// POST /schedule/completion — Record task completion/skip
router.post("/completion", async (req, res) => {
  try {
    const { user_name, schedule_entry_id, date, completed, title } = req.body;
    if (!user_name || !schedule_entry_id || !date || completed === undefined) {
      return res.status(400).json({ detail: "user_name, schedule_entry_id, date, and completed are required" });
    }
    const collections = await getCollections();
    // Upsert: if already recorded for this entry+date, update it
    const filter = { user_name, schedule_entry_id, date };
    const existing = await collections.taskCompletions.findOne(filter);
    if (existing) {
      await collections.taskCompletions.updateOne(filter, { $set: { completed, title: title || existing.title, updatedAt: new Date() } });
      return res.status(200).json({ _id: existing._id, ...filter, completed, title: title || existing.title });
    } else {
      const result = await collections.taskCompletions.insertOne({ user_name, schedule_entry_id, date, completed, title: title || "", createdAt: new Date(), updatedAt: new Date() });
      return res.status(201).json({ _id: result.insertedId, user_name, schedule_entry_id, date, completed, title: title || "" });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /schedule/completions/:user_name/:date — Get completions for a date
router.get("/completions/:user_name/:date", async (req, res) => {
  try {
    const { user_name, date } = req.params;
    const collections = await getCollections();
    const completions = await collections.taskCompletions.find({
      user_name, date,
    }).sort({ createdAt: -1 }).toArray();
    return res.json(completions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /schedule/completions/:user_name — Get all completions for a user
router.get("/completions/:user_name", async (req, res) => {
  try {
    const { user_name } = req.params;
    const collections = await getCollections();
    const completions = await collections.taskCompletions.find({
      user_name,
    }).sort({ date: -1, createdAt: -1 }).toArray();
    return res.json(completions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
