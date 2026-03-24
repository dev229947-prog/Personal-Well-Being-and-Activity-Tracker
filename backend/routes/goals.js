const express = require("express");
const router = express.Router();
const { Goal, Milestone, MilestoneUpdate } = require("../models");
// POST /goals/milestones/:id/updates — Add a progress update for a milestone
router.post("/milestones/:id/updates", async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.id);
    if (!milestone) return res.status(404).json({ detail: "Milestone not found" });
    const { user_name, date, value, note } = req.body;
    if (!user_name || !date || value === undefined) {
      return res.status(400).json({ detail: "user_name, date, and value are required" });
    }
    const update = await MilestoneUpdate.create({
      milestone_id: milestone.id,
      user_name,
      date,
      value,
      note: note || "",
    });
    return res.status(201).json(update);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /goals/milestones/:id/updates — Get all updates for a milestone
router.get("/milestones/:id/updates", async (req, res) => {
  try {
    const milestone = await Milestone.findByPk(req.params.id);
    if (!milestone) return res.status(404).json({ detail: "Milestone not found" });
    const updates = await MilestoneUpdate.findAll({
      where: { milestone_id: milestone.id },
      order: [["date", "ASC"]],
    });
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
    const entry = await Goal.create({
      user_name, title, category, target_value,
      current_value: current_value || 0, unit: unit || "",
      start_date: start_date || null, deadline: deadline || null, status: "active",
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
          goal_id: entry.id,
          title: `${ms.title || title} ${freq === "weekly" ? "Week" : "Day"} ${count + 1}`,
          target_value: ms.target_value || 0,
          frequency: freq,
          sort_order: count,
          completed: false,
        });
        count++;
        if (freq === "weekly") {
          curr.setDate(curr.getDate() + 7);
        } else {
          curr.setDate(curr.getDate() + 1);
        }
      }
      await Milestone.bulkCreate(msRows);
    } else if (Array.isArray(milestones) && milestones.length > 0) {
      // Fallback: create as before if no date range or frequency
      const msRows = milestones.map((m, i) => ({
        goal_id: entry.id,
        title: m.title,
        target_value: m.target_value || 0,
        frequency: (m.frequency === "weekly" ? "weekly" : "daily"),
        sort_order: i,
        completed: false,
      }));
      await Milestone.bulkCreate(msRows);
    }
    // Re-fetch with milestones included
    const full = await Goal.findByPk(entry.id, { include: [{ model: Milestone, as: "milestones" }] });
    return res.status(201).json(full);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

/* ── Milestone routes (static prefix — must come before /:id) ── */

// PUT /goals/milestones/:id
router.put("/milestones/:id", async (req, res) => {
  try {
    const ms = await Milestone.findByPk(req.params.id);
    if (!ms) return res.status(404).json({ detail: "Milestone not found" });
    const { title, target_value, completed, sort_order, frequency } = req.body;
    await ms.update({
      title: title !== undefined ? title : ms.title,
      target_value: target_value !== undefined ? target_value : ms.target_value,
      completed: completed !== undefined ? completed : ms.completed,
      sort_order: sort_order !== undefined ? sort_order : ms.sort_order,
      frequency: (frequency === "weekly" ? "weekly" : "daily"),
    });
    return res.json(ms);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// DELETE /goals/milestones/:id
router.delete("/milestones/:id", async (req, res) => {
  try {
    const ms = await Milestone.findByPk(req.params.id);
    if (!ms) return res.status(404).json({ detail: "Milestone not found" });
    await ms.destroy();
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
    const entries = await Goal.findAll({
      where: { user_name: req.params.user_name },
      include: [{ model: Milestone, as: "milestones" }],
      order: [["createdAt", "DESC"], [{ model: Milestone, as: "milestones" }, "sort_order", "ASC"]],
    });
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// GET /goals/:goal_id/milestones
router.get("/:goal_id/milestones", async (req, res) => {
  try {
    const milestones = await Milestone.findAll({
      where: { goal_id: req.params.goal_id },
      order: [["sort_order", "ASC"]],
    });
    return res.json(milestones);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// POST /goals/:goal_id/milestones
router.post("/:goal_id/milestones", async (req, res) => {
  try {
    const goal = await Goal.findByPk(req.params.goal_id);
    if (!goal) return res.status(404).json({ detail: "Goal not found" });
    const { title, target_value, sort_order } = req.body;
    if (!title) {
      return res.status(400).json({ detail: "title is required" });
    }
    let { frequency } = req.body;
    // Only allow 'daily' or 'weekly', default to 'daily'
    frequency = frequency === "weekly" ? "weekly" : "daily";
    const count = await Milestone.count({ where: { goal_id: goal.id } });
    const ms = await Milestone.create({
      goal_id: goal.id, title,
      target_value: target_value || 0,
      sort_order: sort_order !== undefined ? sort_order : count,
      frequency,
    });
    return res.status(201).json(ms);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// PUT /goals/:id — Update a goal
router.put("/:id", async (req, res) => {
  try {
    const entry = await Goal.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    const { title, category, target_value, current_value, unit, start_date, deadline, status } = req.body;
    await entry.update({
      title: title !== undefined ? title : entry.title,
      category: category !== undefined ? category : entry.category,
      target_value: target_value !== undefined ? target_value : entry.target_value,
      current_value: current_value !== undefined ? current_value : entry.current_value,
      unit: unit !== undefined ? unit : entry.unit,
      start_date: start_date !== undefined ? start_date : entry.start_date,
      deadline: deadline !== undefined ? deadline : entry.deadline,
      status: status !== undefined ? status : entry.status,
    });
    return res.json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// DELETE /goals/:id — Delete a goal (and its milestones)
router.delete("/:id", async (req, res) => {
  try {
    const entry = await Goal.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    await Milestone.destroy({ where: { goal_id: entry.id } });
    await entry.destroy();
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
