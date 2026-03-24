const express = require("express");
const router = express.Router();
const { getCollections, ObjectId } = require("../models");

// POST /goals/milestones/:id/updates — Add a progress update for a milestone
router.post("/milestones/:id/updates", async (req, res) => {
  try {
    const collections = await getCollections();
    const milestone = await collections.milestones.findOne({ _id: new ObjectId(req.params.id) });
    if (!milestone) return res.status(404).json({ detail: "Milestone not found" });
    const { user_name, date, value, note } = req.body;
    if (!user_name || !date || value === undefined) {
      return res.status(400).json({ detail: "user_name, date, and value are required" });
    }
    const result = await collections.milestoneUpdates.insertOne({
      milestone_id: req.params.id,
      user_name,
      date,
      value,
      note: note || "",
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.status(201).json({ _id: result.insertedId, milestone_id: req.params.id, user_name, date, value, note: note || "" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /goals/milestones/:id/updates — Get all updates for a milestone
router.get("/milestones/:id/updates", async (req, res) => {
  try {
    const collections = await getCollections();
    const milestone = await collections.milestones.findOne({ _id: new ObjectId(req.params.id) });
    if (!milestone) return res.status(404).json({ detail: "Milestone not found" });
    const updates = await collections.milestoneUpdates.find({
      milestone_id: req.params.id,
    }).sort({ date: 1 }).toArray();
    return res.json(updates);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// POST /goals/ — Create a new goal (optionally with milestones)
router.post("/", async (req, res) => {
  try {
    const { user_name, title, category, target_value, current_value, unit, start_date, deadline, milestones } = req.body;
    if (!user_name || !title || !category || target_value === undefined) {
      return res.status(400).json({ detail: "user_name, title, category, and target_value are required" });
    }
    const collections = await getCollections();
    const result = await collections.goals.insertOne({
      user_name, title, category, target_value,
      current_value: current_value || 0, unit: unit || "",
      start_date: start_date || null, deadline: deadline || null, status: "active",
      createdAt: new Date(), updatedAt: new Date(),
    });

    // New: Robust auto milestone calculation for daily/weekly
    if (Array.isArray(milestones) && milestones.length > 0 && start_date && deadline && milestones[0].frequency) {
      const ms = milestones[0];
      const freq = ms.frequency === "weekly" ? "weekly" : "daily";
      const start = new Date(start_date);
      const end = new Date(deadline);
      let msRows = [];
      let count = 0;
      let curr = new Date(start);
      while (curr <= end) {
        msRows.push({
          goal_id: result.insertedId.toString(),
          title: `${ms.title || title} ${freq === "weekly" ? "Week" : "Day"} ${count + 1}`,
          target_value: ms.target_value || 0,
          frequency: freq,
          sort_order: count,
          completed: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        });
        count++;
        if (freq === "weekly") {
          curr.setDate(curr.getDate() + 7);
        } else {
          curr.setDate(curr.getDate() + 1);
        }
      }
      if (msRows.length > 0) await collections.milestones.insertMany(msRows);
    } else if (Array.isArray(milestones) && milestones.length > 0) {
      // Fallback: create as before if no date range or frequency
      const msRows = milestones.map((m, i) => ({
        goal_id: result.insertedId.toString(),
        title: m.title,
        target_value: m.target_value || 0,
        frequency: (m.frequency === "weekly" ? "weekly" : "daily"),
        sort_order: i,
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date(),
      }));
      if (msRows.length > 0) await collections.milestones.insertMany(msRows);
    }
    // Re-fetch with milestones included
    const full = await collections.goals.findOne({ _id: result.insertedId });
    const goalMilestones = await collections.milestones.find({ goal_id: result.insertedId.toString() }).sort({ sort_order: 1 }).toArray();
    return res.status(201).json({ ...full, milestones: goalMilestones });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

/* ── Milestone routes (static prefix — must come before /:id) ── */

// PUT /goals/milestones/:id
router.put("/milestones/:id", async (req, res) => {
  try {
    const collections = await getCollections();
    const ms = await collections.milestones.findOne({ _id: new ObjectId(req.params.id) });
    if (!ms) return res.status(404).json({ detail: "Milestone not found" });
    const { title, target_value, completed, sort_order, frequency } = req.body;
    const updates = {
      title: title !== undefined ? title : ms.title,
      target_value: target_value !== undefined ? target_value : ms.target_value,
      completed: completed !== undefined ? completed : ms.completed,
      sort_order: sort_order !== undefined ? sort_order : ms.sort_order,
      frequency: (frequency === "weekly" ? "weekly" : "daily"),
      updatedAt: new Date(),
    };
    await collections.milestones.updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });
    return res.json({ _id: ms._id, ...updates });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// DELETE /goals/milestones/:id
router.delete("/milestones/:id", async (req, res) => {
  try {
    const collections = await getCollections();
    const result = await collections.milestones.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ detail: "Milestone not found" });
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

/* ── Goal CRUD with dynamic :param ── */

// GET /goals/:user_name — Get all goals (with milestones)
router.get("/:user_name", async (req, res) => {
  try {
    const collections = await getCollections();
    const entries = await collections.goals.find({ user_name: req.params.user_name }).sort({ createdAt: -1 }).toArray();
    // Fetch milestones for each goal
    for (let goal of entries) {
      goal.milestones = await collections.milestones.find({ goal_id: goal._id.toString() }).sort({ sort_order: 1 }).toArray();
    }
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /goals/:goal_id/milestones
router.get("/:goal_id/milestones", async (req, res) => {
  try {
    const collections = await getCollections();
    const milestones = await collections.milestones.find({ goal_id: req.params.goal_id }).sort({ sort_order: 1 }).toArray();
    return res.json(milestones);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// POST /goals/:goal_id/milestones
router.post("/:goal_id/milestones", async (req, res) => {
  try {
    const collections = await getCollections();
    const goal = await collections.goals.findOne({ _id: new ObjectId(req.params.goal_id) });
    if (!goal) return res.status(404).json({ detail: "Goal not found" });
    const { title, target_value, sort_order } = req.body;
    if (!title) {
      return res.status(400).json({ detail: "title is required" });
    }
    let { frequency } = req.body;
    // Only allow 'daily' or 'weekly', default to 'daily'
    frequency = frequency === "weekly" ? "weekly" : "daily";
    const count = await collections.milestones.countDocuments({ goal_id: req.params.goal_id });
    const result = await collections.milestones.insertOne({
      goal_id: req.params.goal_id, title,
      target_value: target_value || 0,
      sort_order: sort_order !== undefined ? sort_order : count,
      frequency,
      completed: false,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return res.status(201).json({ _id: result.insertedId, goal_id: req.params.goal_id, title, target_value: target_value || 0, frequency });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// PUT /goals/:id — Update a goal
router.put("/:id", async (req, res) => {
  try {
    const collections = await getCollections();
    const entry = await collections.goals.findOne({ _id: new ObjectId(req.params.id) });
    if (!entry) return res.status(404).json({ detail: "Not found" });
    const { title, category, target_value, current_value, unit, start_date, deadline, status } = req.body;
    const updates = {
      title: title !== undefined ? title : entry.title,
      category: category !== undefined ? category : entry.category,
      target_value: target_value !== undefined ? target_value : entry.target_value,
      current_value: current_value !== undefined ? current_value : entry.current_value,
      unit: unit !== undefined ? unit : entry.unit,
      start_date: start_date !== undefined ? start_date : entry.start_date,
      deadline: deadline !== undefined ? deadline : entry.deadline,
      status: status !== undefined ? status : entry.status,
      updatedAt: new Date(),
    };
    await collections.goals.updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });
    return res.json({ _id: entry._id, ...updates });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// DELETE /goals/:id — Delete a goal (and its milestones)
router.delete("/:id", async (req, res) => {
  try {
    const collections = await getCollections();
    const entry = await collections.goals.findOne({ _id: new ObjectId(req.params.id) });
    if (!entry) return res.status(404).json({ detail: "Not found" });
    await collections.milestones.deleteMany({ goal_id: req.params.id });
    await collections.goals.deleteOne({ _id: new ObjectId(req.params.id) });
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
