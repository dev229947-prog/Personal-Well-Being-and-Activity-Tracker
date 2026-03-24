const express = require("express");
const cors = require("cors");
const sequelize = require("./database");
const config = require("./config");

// Import routes
const authRoutes = require("./routes/auth");
const scheduleRoutes = require("./routes/schedule");
const healthRoutes = require("./routes/health");
const sleepRoutes = require("./routes/sleep");
const nutritionRoutes = require("./routes/nutrition");
const moodRoutes = require("./routes/mood");
const workoutRoutes = require("./routes/workouts");
const goalRoutes = require("./routes/goals");
const journalRoutes = require("./routes/journal");
const recordRoutes = require("./routes/records");
const bmiRoutes = require("./routes/bmi");

const app = express();

// Middleware
app.use(cors({ origin: ["http://localhost:3000"], credentials: true }));
app.use(express.json());

// Routes
app.use("/auth", authRoutes);
app.use("/schedule", scheduleRoutes);
app.use("/health", healthRoutes);
app.use("/sleep", sleepRoutes);
app.use("/nutrition", nutritionRoutes);
app.use("/mood", moodRoutes);
app.use("/workouts", workoutRoutes);
app.use("/goals", goalRoutes);
app.use("/journal", journalRoutes);
app.use("/records", recordRoutes);
app.use("/bmi", bmiRoutes);

// Health check
app.get("/", (_req, res) => {
  res.json({ message: "Welcome to the Well-Being & Activity Tracker API" });
});

// Start server
async function start() {
  await sequelize.query("PRAGMA foreign_keys = OFF;");
  // Drop any leftover backup tables from failed migrations
  const [tables] = await sequelize.query("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%_backup'");
    for (const table of tables) {
      await sequelize.query(`DROP TABLE IF EXISTS \`${table.name}\``);
    }
    await sequelize.sync({ alter: true }); // auto-migrate for new models
  await sequelize.query("PRAGMA foreign_keys = ON;");
  console.log("Database synced (SQLite)");
  app.listen(config.PORT, () => {
    console.log(`Server running at http://localhost:${config.PORT}`);
  });
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
