const { DataTypes } = require("sequelize");
const sequelize = require("./database");

/* ── User ── */
const User = sequelize.define("User", {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  username:        { type: DataTypes.STRING, allowNull: false, unique: true },
  email:           { type: DataTypes.STRING, allowNull: false, unique: true },
  hashed_password: { type: DataTypes.STRING, allowNull: false },
}, { tableName: "users", timestamps: false });

/* ── Schedule Entry ── */
const ScheduleEntry = sequelize.define("ScheduleEntry", {
  id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name:     { type: DataTypes.STRING, allowNull: false },
  title:         { type: DataTypes.STRING, allowNull: false },
  activity_type: { type: DataTypes.STRING, allowNull: false },
  day_of_week:   { type: DataTypes.INTEGER, allowNull: false, validate: { min: 0, max: 6 } },
  start_time:    { type: DataTypes.STRING, allowNull: false },
  end_time:      { type: DataTypes.STRING, allowNull: false },
  color:         { type: DataTypes.STRING, defaultValue: "#6366f1" },
  notes:         { type: DataTypes.TEXT, defaultValue: "" },
}, { tableName: "schedule_entries", timestamps: true });

/* ── Health Metric (steps, calories, weight, heart-rate, etc.) ── */
const HealthMetric = sequelize.define("HealthMetric", {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name:   { type: DataTypes.STRING, allowNull: false },
  metric_type: { type: DataTypes.STRING, allowNull: false },   // steps, calories_burned, weight, heart_rate, bmi, blood_pressure
  value:       { type: DataTypes.FLOAT, allowNull: false },
  unit:        { type: DataTypes.STRING, defaultValue: "" },
  date:        { type: DataTypes.DATEONLY, allowNull: false },
}, { tableName: "health_metrics", timestamps: true });

/* ── Sleep Log ── */
const SleepLog = sequelize.define("SleepLog", {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name:   { type: DataTypes.STRING, allowNull: false },
  date:        { type: DataTypes.DATEONLY, allowNull: false },
  hours:       { type: DataTypes.FLOAT, allowNull: false },
  quality:     { type: DataTypes.INTEGER, defaultValue: 3 },  // 1-5 scale
  rem_hours:   { type: DataTypes.FLOAT, defaultValue: 0 },
  deep_hours:  { type: DataTypes.FLOAT, defaultValue: 0 },
  light_hours: { type: DataTypes.FLOAT, defaultValue: 0 },
  notes:       { type: DataTypes.TEXT, defaultValue: "" },
}, { tableName: "sleep_logs", timestamps: true });

/* ── Nutrition Log ── */
const NutritionLog = sequelize.define("NutritionLog", {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name:   { type: DataTypes.STRING, allowNull: false },
  date:        { type: DataTypes.DATEONLY, allowNull: false },
  meal_type:   { type: DataTypes.STRING, allowNull: false },   // breakfast, lunch, dinner, snack
  description: { type: DataTypes.STRING, defaultValue: "" },
  calories:    { type: DataTypes.FLOAT, defaultValue: 0 },
  protein_g:   { type: DataTypes.FLOAT, defaultValue: 0 },
  carbs_g:     { type: DataTypes.FLOAT, defaultValue: 0 },
  fat_g:       { type: DataTypes.FLOAT, defaultValue: 0 },
  water_ml:    { type: DataTypes.FLOAT, defaultValue: 0 },
}, { tableName: "nutrition_logs", timestamps: true });

/* ── Mood Log ── */
const MoodLog = sequelize.define("MoodLog", {
  id:              { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name:       { type: DataTypes.STRING, allowNull: false },
  date:            { type: DataTypes.DATEONLY, allowNull: false },
  mood_score:      { type: DataTypes.INTEGER, allowNull: false },   // 1-10
  stress_level:    { type: DataTypes.INTEGER, defaultValue: 5 },    // 1-10
  energy_level:    { type: DataTypes.INTEGER, defaultValue: 5 },    // 1-10
  mindfulness_min: { type: DataTypes.FLOAT, defaultValue: 0 },
  notes:           { type: DataTypes.TEXT, defaultValue: "" },
}, { tableName: "mood_logs", timestamps: true });

/* ── Workout Log ── */
const WorkoutLog = sequelize.define("WorkoutLog", {
  id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name:     { type: DataTypes.STRING, allowNull: false },
  date:          { type: DataTypes.DATEONLY, allowNull: false },
  exercise_type: { type: DataTypes.STRING, allowNull: false },     // cardio, strength, flexibility, sports
  exercise_name: { type: DataTypes.STRING, allowNull: false },
  duration_min:  { type: DataTypes.FLOAT, defaultValue: 0 },
  sets:          { type: DataTypes.INTEGER, defaultValue: 0 },
  reps:          { type: DataTypes.INTEGER, defaultValue: 0 },
  calories_burned:{ type: DataTypes.FLOAT, defaultValue: 0 },
  notes:         { type: DataTypes.TEXT, defaultValue: "" },
}, { tableName: "workout_logs", timestamps: true });

/* ── Goal ── */
const Goal = sequelize.define("Goal", {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name:   { type: DataTypes.STRING, allowNull: false },
  title:       { type: DataTypes.STRING, allowNull: false },
  category:    { type: DataTypes.STRING, allowNull: false },   // fitness, nutrition, sleep, mental, general
  target_value:{ type: DataTypes.FLOAT, allowNull: false },
  current_value:{ type: DataTypes.FLOAT, defaultValue: 0 },
  unit:        { type: DataTypes.STRING, defaultValue: "" },
  start_date:  { type: DataTypes.DATEONLY },
  deadline:    { type: DataTypes.DATEONLY },
  status:      { type: DataTypes.STRING, defaultValue: "active" },  // active, completed, paused
}, { tableName: "goals", timestamps: true });

/* ── Journal Entry ── */
const JournalEntry = sequelize.define("JournalEntry", {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name:   { type: DataTypes.STRING, allowNull: false },
  date:        { type: DataTypes.DATEONLY, allowNull: false },
  title:       { type: DataTypes.STRING, defaultValue: "" },
  content:     { type: DataTypes.TEXT, allowNull: false },
  mood_tag:    { type: DataTypes.STRING, defaultValue: "" },
  tags:        { type: DataTypes.STRING, defaultValue: "" },   // comma-separated
}, { tableName: "journal_entries", timestamps: true });

/* ── Health Record (appointments, vaccines, medications) ── */
const HealthRecord = sequelize.define("HealthRecord", {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name:   { type: DataTypes.STRING, allowNull: false },
  record_type: { type: DataTypes.STRING, allowNull: false },  // appointment, vaccine, medication
  title:       { type: DataTypes.STRING, allowNull: false },
  description: { type: DataTypes.TEXT, defaultValue: "" },
  date:        { type: DataTypes.DATEONLY },
  time:        { type: DataTypes.STRING, defaultValue: "" },
  recurring:   { type: DataTypes.BOOLEAN, defaultValue: false },
  status:      { type: DataTypes.STRING, defaultValue: "active" }, // active, completed, missed
}, { tableName: "health_records", timestamps: true });

/* ── Task Completion ── */
const TaskCompletion = sequelize.define("TaskCompletion", {
  id:                { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name:         { type: DataTypes.STRING, allowNull: false },
  schedule_entry_id: { type: DataTypes.INTEGER, allowNull: false },
  date:              { type: DataTypes.DATEONLY, allowNull: false },
  completed:         { type: DataTypes.BOOLEAN, allowNull: false },
  title:             { type: DataTypes.STRING, defaultValue: "" },
}, { tableName: "task_completions", timestamps: true });

/* ── Milestone (sub-tasks for goals) ── */
const Milestone = sequelize.define("Milestone", {
  id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  goal_id:     { type: DataTypes.INTEGER, allowNull: false },
  title:       { type: DataTypes.STRING, allowNull: false },
  target_value:{ type: DataTypes.FLOAT, allowNull: false },
  completed:   { type: DataTypes.BOOLEAN, defaultValue: false },
  sort_order:  { type: DataTypes.INTEGER, defaultValue: 0 },
  // Removed due_date field
  frequency:   { type: DataTypes.STRING, defaultValue: "daily" },  // daily, weekly
}, { tableName: "milestones", timestamps: true });

Goal.hasMany(Milestone, { foreignKey: "goal_id", as: "milestones", onDelete: "CASCADE" });
Milestone.belongsTo(Goal, { foreignKey: "goal_id" });


/* ── Weight / BMI Log ── */
const WeightLog = sequelize.define("WeightLog", {
  id:            { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  user_name:     { type: DataTypes.STRING, allowNull: false },
  date:          { type: DataTypes.DATEONLY, allowNull: false },
  weight_kg:     { type: DataTypes.FLOAT, allowNull: false },
  height_cm:     { type: DataTypes.FLOAT, allowNull: false },
  bmi:           { type: DataTypes.FLOAT, allowNull: false },
  calories_in:   { type: DataTypes.FLOAT, defaultValue: 0 },        // daily calorie intake
  calories_out:  { type: DataTypes.FLOAT, defaultValue: 0 },        // daily calories burned
  goal_type:     { type: DataTypes.STRING, defaultValue: "lose" },   // lose | gain | maintain
  target_weight: { type: DataTypes.FLOAT },
  notes:         { type: DataTypes.TEXT, defaultValue: "" },
}, { tableName: "weight_logs", timestamps: true });

/* ── Milestone Update (progress log for milestones) ── */
const MilestoneUpdate = sequelize.define("MilestoneUpdate", {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  milestone_id: { type: DataTypes.INTEGER, allowNull: false },
  user_name: { type: DataTypes.STRING, allowNull: false },
  date: { type: DataTypes.DATEONLY, allowNull: false },
  value: { type: DataTypes.FLOAT, allowNull: false },
  note: { type: DataTypes.TEXT, defaultValue: "" },
}, { tableName: "milestone_updates", timestamps: true });

Milestone.hasMany(MilestoneUpdate, { foreignKey: "milestone_id", as: "updates", onDelete: "CASCADE" });
MilestoneUpdate.belongsTo(Milestone, { foreignKey: "milestone_id" });

module.exports = {
  User, ScheduleEntry, HealthMetric, SleepLog, NutritionLog,
  MoodLog, WorkoutLog, Goal, JournalEntry, HealthRecord, WeightLog, TaskCompletion, Milestone,
  MilestoneUpdate,
};
