const express = require("express");
const router = express.Router();
const { User } = require("../models");
const { hashPassword, verifyPassword, createAccessToken } = require("../auth");
const { Op } = require("sequelize");

// POST /auth/signup
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ detail: "username, email and password are required" });
    }

    const existing = await User.findOne({
      where: { [Op.or]: [{ username }, { email }] },
    });
    if (existing) {
      return res.status(400).json({ detail: "Username or email already registered" });
    }

    const hashed_password = await hashPassword(password);
    const user = await User.create({ username, email, hashed_password });

    return res.status(201).json({ id: user.id, username: user.username, email: user.email });
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

    const user = await User.findOne({ where: { username } });
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
