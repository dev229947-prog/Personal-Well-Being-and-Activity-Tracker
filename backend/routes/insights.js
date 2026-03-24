const express = require("express");
const router = express.Router();
const { getInsight } = require("../rulesEngine");

// GET /insights/:activity_type/:value
router.get("/:activity_type/:value", (req, res) => {
  const { activity_type, value } = req.params;
  const numericValue = parseFloat(value);

  if (isNaN(numericValue)) {
    return res.status(400).json({ detail: "value must be a number" });
  }

  const insight = getInsight(activity_type, numericValue);
  return res.json({ insight });
});

module.exports = router;
