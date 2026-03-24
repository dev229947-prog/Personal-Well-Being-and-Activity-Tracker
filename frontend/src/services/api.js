import axios from "axios";

// Use the same origin in production, localhost in development
const API_BASE = process.env.NODE_ENV === 'production' 
  ? window.location.origin
  : "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

// ── Schedule ──
export const getSchedule = (userName) => api.get(`/schedule/${userName}`).then(r => r.data);
export const addScheduleEntry = (entry) => api.post("/schedule/", entry).then(r => r.data);
export const addScheduleBulk = (userName, entries) => api.post("/schedule/bulk", { user_name: userName, entries }).then(r => r.data);
export const clearSchedule = (userName) => api.delete(`/schedule/all/${userName}`).then(r => r.data);
export const updateScheduleEntry = (id, data) => api.put(`/schedule/${id}`, data).then(r => r.data);
export const deleteScheduleEntry = (id) => api.delete(`/schedule/${id}`).then(r => r.data);
export const recordTaskCompletion = (data) => api.post("/schedule/completion", data).then(r => r.data);
export const getTaskCompletions = (userName, date) => api.get(`/schedule/completions/${userName}/${date}`).then(r => r.data);

// ── Health Metrics ──
export const getHealthMetrics = (userName) => api.get(`/health/${userName}`).then(r => r.data);
export const getHealthMetricsByType = (userName, type) => api.get(`/health/${userName}/${type}`).then(r => r.data);
export const addHealthMetric = (data) => api.post("/health/", data).then(r => r.data);
export const deleteHealthMetric = (id) => api.delete(`/health/${id}`).then(r => r.data);

// ── Sleep ──
export const getSleepLogs = (userName) => api.get(`/sleep/${userName}`).then(r => r.data);
export const addSleepLog = (data) => api.post("/sleep/", data).then(r => r.data);
export const deleteSleepLog = (id) => api.delete(`/sleep/${id}`).then(r => r.data);

// ── Nutrition ──
export const getNutritionLogs = (userName) => api.get(`/nutrition/${userName}`).then(r => r.data);
export const addNutritionLog = (data) => api.post("/nutrition/", data).then(r => r.data);
export const deleteNutritionLog = (id) => api.delete(`/nutrition/${id}`).then(r => r.data);

// ── Mood ──
export const getMoodLogs = (userName) => api.get(`/mood/${userName}`).then(r => r.data);
export const addMoodLog = (data) => api.post("/mood/", data).then(r => r.data);
export const deleteMoodLog = (id) => api.delete(`/mood/${id}`).then(r => r.data);

// ── Workouts ──
export const getWorkoutLogs = (userName) => api.get(`/workouts/${userName}`).then(r => r.data);
export const addWorkoutLog = (data) => api.post("/workouts/", data).then(r => r.data);
export const deleteWorkoutLog = (id) => api.delete(`/workouts/${id}`).then(r => r.data);

// ── Goals ──
export const getGoals = (userName) => api.get(`/goals/${userName}`).then(r => r.data);
export const addGoal = (data) => api.post("/goals/", data).then(r => r.data);
export const updateGoal = (id, data) => api.put(`/goals/${id}`, data).then(r => r.data);
export const deleteGoal = (id) => api.delete(`/goals/${id}`).then(r => r.data);

// ── Milestones ──
export const getMilestones = (goalId) => api.get(`/goals/${goalId}/milestones`).then(r => r.data);
export const addMilestone = (goalId, data) => api.post(`/goals/${goalId}/milestones`, data).then(r => r.data);
export const updateMilestone = (id, data) => api.put(`/goals/milestones/${id}`, data).then(r => r.data);
export const deleteMilestone = (id) => api.delete(`/goals/milestones/${id}`).then(r => r.data);

// ── Journal ──
export const getJournalEntries = (userName) => api.get(`/journal/${userName}`).then(r => r.data);
export const addJournalEntry = (data) => api.post("/journal/", data).then(r => r.data);
export const updateJournalEntry = (id, data) => api.put(`/journal/${id}`, data).then(r => r.data);
export const deleteJournalEntry = (id) => api.delete(`/journal/${id}`).then(r => r.data);

// ── Health Records ──
export const getHealthRecords = (userName) => api.get(`/records/${userName}`).then(r => r.data);
export const addHealthRecord = (data) => api.post("/records/", data).then(r => r.data);
export const updateHealthRecord = (id, data) => api.put(`/records/${id}`, data).then(r => r.data);
export const deleteHealthRecord = (id) => api.delete(`/records/${id}`).then(r => r.data);

// ── BMI / Weight ──
export const getWeightLogs = (userName) => api.get(`/bmi/${userName}`).then(r => r.data);
export const addWeightLog = (data) => api.post("/bmi/", data).then(r => r.data);
export const updateWeightLog = (id, data) => api.put(`/bmi/${id}`, data).then(r => r.data);
export const deleteWeightLog = (id) => api.delete(`/bmi/${id}`).then(r => r.data);


// ── Auth ──
export const signup = (username, email, password) => api.post("/auth/signup", { username, email, password }).then(r => r.data);
export const login = (username, password) => api.post("/auth/login", { username, password }).then(r => r.data);

export default api;
