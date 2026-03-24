require("dotenv").config();

module.exports = {
  PORT: process.env.PORT || 8000,
  JWT_SECRET: process.env.JWT_SECRET || "wellbeing-tracker-secret-key-change-in-production",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || "1h",
  DB_PATH: process.env.DB_PATH || "./wellbeing.db",
};
