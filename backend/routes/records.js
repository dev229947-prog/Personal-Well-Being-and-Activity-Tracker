const express = require("express");
const router = express.Router();
const { getCollections, ObjectId } = require("../models");

router.post("/", async (req, res) => {
  try {
    const { user_name, record_type, title, description, date, time, recurring } = req.body;
    if (!user_name || !record_type || !title) {
      return res.status(400).json({ detail: "user_name, record_type, and title are required" });
    }
    const collections = await getCollections();
    const result = await collections.healthRecords.insertOne({
      user_name, record_type, title, description: description || "",
      date: date || null, time: time || "", recurring: recurring || false,
      status: "active", createdAt: new Date(), updatedAt: new Date(),
    });
    return res.status(201).json({ _id: result.insertedId, user_name, record_type, title });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.get("/:user_name", async (req, res) => {
  try {
    const collections = await getCollections();
    const entries = await collections.healthRecords.find({
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
    const entry = await collections.healthRecords.findOne({ _id: new ObjectId(req.params.id) });
    if (!entry) return res.status(404).json({ detail: "Not found" });
    const { record_type, title, description, date, time, recurring, status } = req.body;
    const updates = {
      record_type: record_type !== undefined ? record_type : entry.record_type,
      title: title !== undefined ? title : entry.title,
      description: description !== undefined ? description : entry.description,
      date: date !== undefined ? date : entry.date,
      time: time !== undefined ? time : entry.time,
      recurring: recurring !== undefined ? recurring : entry.recurring,
      status: status !== undefined ? status : entry.status,
      updatedAt: new Date(),
    };
    await collections.healthRecords.updateOne({ _id: new ObjectId(req.params.id) }, { $set: updates });
    return res.json({ _id: entry._id, ...updates });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const collections = await getCollections();
    const result = await collections.healthRecords.deleteOne({ _id: new ObjectId(req.params.id) });
    if (result.deletedCount === 0) return res.status(404).json({ detail: "Not found" });
    return res.json({ detail: "Deleted" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
