const express = require("express");
const router = express.Router();
const { JournalEntry } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_name, date, title, content, mood_tag, tags } = req.body;
    if (!user_name || !content) {
      return res.status(400).json({ detail: "user_name and content are required" });
    }
    const entryDate = date || new Date().toISOString().split("T")[0];
    const entry = await JournalEntry.create({
      user_name, date: entryDate, title: title || "", content,
      mood_tag: mood_tag || "", tags: tags || "",
    });
    return res.status(201).json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/:user_name", async (req, res) => {
  try {
    const entries = await JournalEntry.findAll({
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
    const entry = await JournalEntry.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    const { title, content, mood_tag, tags } = req.body;
    await entry.update({
      title: title !== undefined ? title : entry.title,
      content: content !== undefined ? content : entry.content,
      mood_tag: mood_tag !== undefined ? mood_tag : entry.mood_tag,
      tags: tags !== undefined ? tags : entry.tags,
    });
    return res.json(entry);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const entry = await JournalEntry.findByPk(req.params.id);
    if (!entry) return res.status(404).json({ detail: "Not found" });
    await entry.destroy();
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
