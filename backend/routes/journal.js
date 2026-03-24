const express = require("express");
const router = express.Router();
const { getCollections, ObjectId } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_name, date, title, content, mood_tag, tags } = req.body;
    if (!user_name || !content) {
      return res.status(400).json({ detail: "user_name and content are required" });
    }
    const entryDate = date || new Date().toISOString().split("T")[0];
    const collections = await getCollections();
    const result = await collections.journalEntries.insertOne({
      user_name, date: entryDate, title: title || "", content,
      mood_tag: mood_tag || "", tags: tags || "", createdAt: new Date(), updatedAt: new Date(),
    });
    return res.status(201).json({ _id: result.insertedId, user_name, date: entryDate, content });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/:user_name", async (req, res) => {
  try {
    const collections = await getCollections();
    const entries = await collections.journalEntries.find({
      user_name: req.params.user_name,
    }).sort({ date: -1 }).toArray();
    return res.json(entries);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const collections = await getCollections();
    const entry = await collections.journalEntries.findOne({ _id: new ObjectId(req.params.id) });
    if (!entry) return res.status(404).json({ detail: "Not found" });
    const { title, content, mood_tag, tags } = req.body;
    const updates = {
      title: title !== undefined ? title : entry.title,
      content: content !== undefined ? content : entry.content,
      mood_tag: mood_tag !== undefined ? mood_tag : entry.mood_tag,
      tags: tags !== undefined ? tags : entry.tags,
      updatedAt: new Date(),
    };
    await collections.journalEntries.updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });
    return res.json({ _id: entry._id, ...updates });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const collections = await getCollections();
    const result = await collections.journalEntries.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ detail: "Not found" });
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
