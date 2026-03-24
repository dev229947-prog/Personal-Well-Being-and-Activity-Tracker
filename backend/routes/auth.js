const express = require("express");
const router = express.Router();
const { getCollections } = require("../models");
const { hashPassword, verifyPassword, createAccessToken } = require("../auth");

// POST /auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ detail: "username, email and password are required" });
    }

    const collections = await getCollections();
    const existing = await collections.users.findOne({
      $or: [{ username }, { email }]
    });
    if (existing) {
      return res.status(400).json({ detail: "Username or email already registered" });
    }

    const hashed_password = await hashPassword(password);
    const result = await collections.users.insertOne({ username, email, hashed_password, createdAt: new Date(), updatedAt: new Date() });

    return res.status(201).json({ _id: result.insertedId, username, email });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

// POST /auth/login
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ detail: "username and password are required" });
    }

    const collections = await getCollections();
    const user = await collections.users.findOne({ username });
    if (!user || !(await verifyPassword(password, user.hashed_password))) {
      return res.status(401).json({ detail: "Invalid credentials" });
    }

    const access_token = createAccessToken({ sub: user.username });
    return res.json({ access_token, token_type: "bearer" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ detail: "Internal server error" });
  }
});

module.exports = router;
