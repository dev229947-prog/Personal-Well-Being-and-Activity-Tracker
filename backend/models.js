const { connectDB } = require("./database");
const { ObjectId } = require("mongodb");

// Helper function to get collections
async function getCollections() {
  const db = await connectDB('wellbeing_tracker');
  return {
    users: db.collection('users'),
    scheduleEntries: db.collection('schedule_entries'),
    healthMetrics: db.collection('health_metrics'),
    sleepLogs: db.collection('sleep_logs'),
    nutritionLogs: db.collection('nutrition_logs'),
    moodLogs: db.collection('mood_logs'),
    workoutLogs: db.collection('workout_logs'),
    goals: db.collection('goals'),
    journalEntries: db.collection('journal_entries'),
    healthRecords: db.collection('health_records'),
    weightLogs: db.collection('weight_logs'),
    taskCompletions: db.collection('task_completions'),
    milestones: db.collection('milestones'),
    milestoneUpdates: db.collection('milestone_updates'),
  };
}

// Create indexes for collections (call once on startup)
async function createIndexes() {
  const collections = await getCollections();
  
  // User indexes
  await collections.users.createIndex({ username: 1 }, { unique: true });
  await collections.users.createIndex({ email: 1 }, { unique: true });
  
  // Schedule indexes
  await collections.scheduleEntries.createIndex({ user_name: 1 });
  
  // Health metric indexes
  await collections.healthMetrics.createIndex({ user_name: 1 });
  await collections.healthMetrics.createIndex({ date: 1 });
  
  // Sleep log indexes
  await collections.sleepLogs.createIndex({ user_name: 1 });
  await collections.sleepLogs.createIndex({ date: 1 });
  
  // Nutrition log indexes
  await collections.nutritionLogs.createIndex({ user_name: 1 });
  await collections.nutritionLogs.createIndex({ date: 1 });
  
  // Mood log indexes
  await collections.moodLogs.createIndex({ user_name: 1 });
  await collections.moodLogs.createIndex({ date: 1 });
  
  // Workout log indexes
  await collections.workoutLogs.createIndex({ user_name: 1 });
  await collections.workoutLogs.createIndex({ date: 1 });
  
  // Goal indexes
  await collections.goals.createIndex({ user_name: 1 });
  
  // Journal entry indexes
  await collections.journalEntries.createIndex({ user_name: 1 });
  await collections.journalEntries.createIndex({ date: 1 });
  
  // Health record indexes
  await collections.healthRecords.createIndex({ user_name: 1 });
  
  // Weight log indexes
  await collections.weightLogs.createIndex({ user_name: 1 });
  await collections.weightLogs.createIndex({ date: 1 });
  
  // Task completion indexes
  await collections.taskCompletions.createIndex({ user_name: 1 });
  await collections.taskCompletions.createIndex({ date: 1 });
  
  // Milestone indexes
  await collections.milestones.createIndex({ goal_id: 1 });
  
  // Milestone update indexes
  await collections.milestoneUpdates.createIndex({ milestone_id: 1 });
}

/* ── MongoDB Document Schemas (for reference) ── */
// User: { _id, username, email, hashed_password, createdAt, updatedAt }
// ScheduleEntry: { _id, user_name, title, activity_type, day_of_week, start_time, end_time, color, notes, createdAt, updatedAt }
// HealthMetric: { _id, user_name, metric_type, value, unit, date, createdAt, updatedAt }
// SleepLog: { _id, user_name, date, hours, quality, rem_hours, deep_hours, light_hours, notes, createdAt, updatedAt }
// NutritionLog: { _id, user_name, date, meal_type, description, calories, protein_g, carbs_g, fat_g, water_ml, createdAt, updatedAt }
// MoodLog: { _id, user_name, date, mood_score, stress_level, energy_level, mindfulness_min, notes, createdAt, updatedAt }
// WorkoutLog: { _id, user_name, date, exercise_type, exercise_name, duration_min, sets, reps, calories_burned, notes, createdAt, updatedAt }
// Goal: { _id, user_name, title, category, target_value, current_value, unit, start_date, deadline, status, createdAt, updatedAt }
// JournalEntry: { _id, user_name, date, title, content, mood_tag, tags, createdAt, updatedAt }
// HealthRecord: { _id, user_name, record_type, title, description, date, time, recurring, status, createdAt, updatedAt }
// WeightLog: { _id, user_name, date, weight_kg, height_cm, bmi, calories_in, calories_out, goal_type, target_weight, notes, createdAt, updatedAt }
// TaskCompletion: { _id, user_name, schedule_entry_id, date, completed, title, createdAt, updatedAt }
// Milestone: { _id, goal_id, title, target_value, completed, sort_order, frequency, createdAt, updatedAt }
// MilestoneUpdate: { _id, milestone_id, user_name, date, value, note, createdAt, updatedAt }

module.exports = { getCollections, createIndexes, ObjectId };
