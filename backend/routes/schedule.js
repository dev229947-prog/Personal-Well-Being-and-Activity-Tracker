const express = require("express");
const router = express.Router();
const { ScheduleEntry, TaskCompletion } = require("../models");

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
    }));
    const created = await ScheduleEntry.bulkCreate(rows);
    return res.status(201).json(created);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// DELETE /schedule/all/:user_name — Delete all entries for a user (for template reset)
router.delete("/all/:user_name", async (req, res) => {
  try {
    const count = await ScheduleEntry.destroy({ where: { user_name: req.params.user_name } });
    return res.json({ detail: `Deleted ${count} entries` });
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

    const entry = await ScheduleEntry.create({
      user_name,
      title,
      activity_type,
      day_of_week,
      start_time,
      end_time,
      color: color || "#6366f1",
      notes: notes || "",
    });
    return res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /schedule/:user_name — Get all schedule entries for a user
router.get("/:user_name", async (req, res) => {
  try {
    const { user_name } = req.params;
    const entries = await ScheduleEntry.findAll({
      where: { user_name },
      order: [["day_of_week", "ASC"], ["start_time", "ASC"]],
    });
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
    const entry = await ScheduleEntry.findByPk(id);

    if (!entry) {
      return res.status(404).json({ detail: "Schedule entry not found" });
    }

    const { title, activity_type, day_of_week, start_time, end_time, color, notes } = req.body;

    if (day_of_week !== undefined && (day_of_week < 0 || day_of_week > 6)) {
      return res.status(400).json({ detail: "day_of_week must be between 0 (Monday) and 6 (Sunday)" });
    }

    await entry.update({
      title: title !== undefined ? title : entry.title,
      activity_type: activity_type !== undefined ? activity_type : entry.activity_type,
      day_of_week: day_of_week !== undefined ? day_of_week : entry.day_of_week,
      start_time: start_time !== undefined ? start_time : entry.start_time,
      end_time: end_time !== undefined ? end_time : entry.end_time,
      color: color !== undefined ? color : entry.color,
      notes: notes !== undefined ? notes : entry.notes,
    });

    return res.json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// DELETE /schedule/:id — Delete a schedule entry
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const entry = await ScheduleEntry.findByPk(id);

    if (!entry) {
      return res.status(404).json({ detail: "Schedule entry not found" });
    }

    await entry.destroy();
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
    // Upsert: if already recorded for this entry+date, update it
    const [record, created] = await TaskCompletion.findOrCreate({
      where: { user_name, schedule_entry_id, date },
      defaults: { completed, title: title || "" },
    });
    if (!created) {
      await record.update({ completed, title: title || record.title });
    }
    return res.status(created ? 201 : 200).json(record);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /schedule/completions/:user_name/:date — Get completions for a date
router.get("/completions/:user_name/:date", async (req, res) => {
  try {
    const { user_name, date } = req.params;
    const completions = await TaskCompletion.findAll({
      where: { user_name, date },
      order: [["createdAt", "DESC"]],
    });
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
    const completions = await TaskCompletion.findAll({
      where: { user_name },
      order: [["date", "DESC"], ["createdAt", "DESC"]],
    });
    return res.json(completions);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
