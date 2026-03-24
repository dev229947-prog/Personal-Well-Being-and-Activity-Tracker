const express = require("express");
const cors = require("cors");
const path = require("path");
const { connectDB } = require("./database");
const { createIndexes } = require("./models");
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
app.use(cors({ 
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL || "https://personal-well-being-and-activity-tracker.onrender.com"]
    : ["http://localhost:3000"], 
  credentials: true 
}));
app.use(express.json());

// Serve static files from React build
app.use(express.static(path.join(__dirname, '../frontend/build')));

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
app.get("/api", (_req, res) => {
  res.json({ message: "Welcome to the Well-Being & Activity Tracker API" });
});

// Serve index.html for React routing
app.get('*', (_req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/build/index.html'));
});

// Start server
async function start() {
  try {
    const db = await connectDB('wellbeing_tracker');
    console.log("Connected to MongoDB");
    
    // Create indexes
    await createIndexes();
    console.log("Indexes created");
    
    app.listen(config.PORT, () => {
      console.log(`Server running at http://localhost:${config.PORT}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
}

start().catch((err) => {
  console.error("Failed to start server:", err);
  process.exit(1);
});
