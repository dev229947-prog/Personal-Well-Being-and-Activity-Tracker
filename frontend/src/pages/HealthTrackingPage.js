import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getHealthMetrics, addHealthMetric, deleteHealthMetric,
  getWorkoutLogs, addWorkoutLog, deleteWorkoutLog,
} from "../services/api";
import KPICards from "../components/KPICards";
import DataTable from "../components/DataTable";
import { TrendLineChart, ActivityPieChart, ComparisonBarChart } from "../components/Charts";
import ActivityTimer from "../components/ActivityTimer";

const METRIC_TYPES = [
  { value: "steps", label: "Steps", unit: "steps", icon: "bi-shoe" },
  { value: "calories_burned", label: "Calories Burned", unit: "kcal", icon: "bi-fire" },
  { value: "weight", label: "Weight", unit: "kg", icon: "bi-speedometer" },
  { value: "heart_rate", label: "Heart Rate", unit: "bpm", icon: "bi-heart-pulse" },
  { value: "blood_pressure_sys", label: "Blood Pressure (Sys)", unit: "mmHg", icon: "bi-droplet" },
];

const EXERCISE_TYPES = [
  { value: "cardio", label: "Cardio" },
  { value: "strength", label: "Strength" },
  { value: "flexibility", label: "Flexibility" },
  { value: "sports", label: "Sports" },
  { value: "hiit", label: "HIIT" },
];

export default function HealthTrackingPage() {
  const { user } = useAuth();
  const uname = user?.username || "guest";
  const [metrics, setMetrics] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("metrics");

  // Form state - metrics
  const [mType, setMType] = useState("steps");
  const [mValue, setMValue] = useState("");
  const [mDate, setMDate] = useState(new Date().toISOString().split("T")[0]);
  // Form state - workouts
  const [wType, setWType] = useState("cardio");
  const [wName, setWName] = useState("");
  const [wDuration, setWDuration] = useState("");
  const [wSets, setWSets] = useState("");
  const [wReps, setWReps] = useState("");
  const [wCals, setWCals] = useState("");
  const [wDate, setWDate] = useState(new Date().toISOString().split("T")[0]);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  const load = async () => {
    try {
      const [m, w] = await Promise.all([getHealthMetrics(uname), getWorkoutLogs(uname)]);
      setMetrics(m);
      setWorkouts(w);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  useEffect(() => { load(); }, [uname, load]);

  // KPIs
  const today = new Date().toISOString().split("T")[0];
  const todaySteps = metrics.filter(m => m.metric_type === "steps" && m.date === today).reduce((s, m) => s + m.value, 0);
  const todayCals = metrics.filter(m => m.metric_type === "calories_burned" && m.date === today).reduce((s, m) => s + m.value, 0);
  const todayWorkouts = workouts.filter(w => w.date === today).length;
  const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - 7);
  const weekWorkouts = workouts.filter(w => new Date(w.date) >= weekStart).length;
  const totalWorkoutMins = workouts.filter(w => new Date(w.date) >= weekStart).reduce((s, w) => s + (w.duration_min || 0), 0);

  // Chart data
  const trendData = useMemo(() => {
    const grouped = {};
    metrics.forEach(m => {
      if (!grouped[m.date]) grouped[m.date] = { date: m.date };
      grouped[m.date][m.metric_type] = (grouped[m.date][m.metric_type] || 0) + m.value;
    });
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  }, [metrics]);

  const pieData = useMemo(() => {
    const counts = {};
    workouts.forEach(w => { counts[w.exercise_type] = (counts[w.exercise_type] || 0) + 1; });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [workouts]);

  const weeklyBarData = useMemo(() => {
    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const data = days.map((d, i) => ({ name: d, workouts: 0, duration: 0 }));
    workouts.filter(w => new Date(w.date) >= weekStart).forEach(w => {
      const dayIdx = (new Date(w.date).getDay() + 6) % 7;
      data[dayIdx].workouts += 1;
      data[dayIdx].duration += w.duration_min || 0;
    });
    return data;
  }, [workouts, weekStart]);

  const handleAddMetric = async (e) => {
    e.preventDefault();
    setFormMsg({ type: "", text: "" });
    if (!mValue || isNaN(mValue)) { setFormMsg({ type: "danger", text: "Enter a valid number" }); return; }
    try {
      const info = METRIC_TYPES.find(t => t.value === mType);
      await addHealthMetric({ user_name: uname, metric_type: mType, value: parseFloat(mValue), unit: info?.unit || "", date: mDate });
      setFormMsg({ type: "success", text: "Metric logged!" });
      setMValue("");
      load();
    } catch (e) { setFormMsg({ type: "danger", text: "Failed to save." }); }
  };

  const handleAddWorkout = async (e) => {
    e.preventDefault();
    setFormMsg({ type: "", text: "" });
    if (!wName.trim()) { setFormMsg({ type: "danger", text: "Enter exercise name" }); return; }
    try {
      await addWorkoutLog({
        user_name: uname, date: wDate, exercise_type: wType, exercise_name: wName.trim(),
        duration_min: parseFloat(wDuration) || 0, sets: parseInt(wSets) || 0,
        reps: parseInt(wReps) || 0, calories_burned: parseFloat(wCals) || 0,
      });
      setFormMsg({ type: "success", text: "Workout logged!" });
      setWName(""); setWDuration(""); setWSets(""); setWReps(""); setWCals("");
      load();
    } catch (e) { setFormMsg({ type: "danger", text: "Failed to save." }); }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <h2 className="wb-page-header mb-4"><i className="bi bi-heart-pulse me-2"></i>Health & Fitness Tracking</h2>

      {/* KPIs */}
      <KPICards kpis={[
        { icon: "bi-shoe", label: "Steps Today", value: todaySteps.toLocaleString(), variant: "primary", progress: Math.min(100, (todaySteps / 10000) * 100) },
        { icon: "bi-fire", label: "Calories Burned", value: todayCals.toLocaleString(), variant: "danger" },
        { icon: "bi-lightning", label: "Workouts Today", value: todayWorkouts, variant: "success" },
        { icon: "bi-calendar-week", label: "Weekly Workouts", value: weekWorkouts, variant: "accent" },
        { icon: "bi-clock-history", label: "Weekly Minutes", value: totalWorkoutMins, variant: "purple" },
        { icon: "bi-activity", label: "Total Entries", value: metrics.length + workouts.length, variant: "info" },
      ]} />

      {/* Charts Row */}
      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <TrendLineChart data={trendData} title="Health Metrics Trend (Last 14 Days)"
            icon="bi-graph-up" lines={[
              { key: "steps", label: "Steps", color: "#6366f1" },
              { key: "calories_burned", label: "Calories", color: "#ef4444" },
              { key: "heart_rate", label: "Heart Rate", color: "#10b981" },
            ]}
          />
        </div>
        <div className="col-lg-4">
          <ActivityPieChart data={pieData} title="Workout Types" />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <ComparisonBarChart data={weeklyBarData} title="This Week's Workouts" icon="bi-bar-chart-fill"
            bars={[
              { key: "workouts", label: "Workouts", color: "#6366f1" },
              { key: "duration", label: "Duration (min)", color: "#10b981" },
            ]}
          />
        </div>
        <div className="col-lg-6">
          <ActivityTimer />
        </div>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills mb-4">
        {[
          { key: "metrics", icon: "bi-speedometer2", label: "Log Metrics" },
          { key: "workouts", icon: "bi-lightning", label: "Log Workout" },
          { key: "history", icon: "bi-table", label: "History" },
        ].map(t => (
          <li className="nav-item" key={t.key}>
            <button className={`nav-link ${tab === t.key ? "active" : ""}`} onClick={() => setTab(t.key)}>
              <i className={`bi ${t.icon} me-1`}></i>{t.label}
            </button>
          </li>
        ))}
      </ul>

      {/* Tab Content */}
      {tab === "metrics" && (
        <div className="wb-card-static p-4">
          <h5 className="fw-bold mb-3 wb-card-title"><i className="bi bi-plus-circle me-2"></i>Log Health Metric</h5>
          <form onSubmit={handleAddMetric}>
            <div className="row g-3">
              <div className="col-md-3">
                <label className="form-label">Metric Type</label>
                <select className="form-select" value={mType} onChange={e => setMType(e.target.value)}>
                  {METRIC_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="col-md-3">
                <label className="form-label">Value ({METRIC_TYPES.find(t => t.value === mType)?.unit})</label>
                <input type="number" className="form-control" value={mValue} onChange={e => setMValue(e.target.value)} min="0" step="0.1" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" value={mDate} onChange={e => setMDate(e.target.value)} />
              </div>
              <div className="col-md-3 d-flex align-items-end">
                <button className="btn btn-wb-primary w-100" type="submit"><i className="bi bi-plus-lg me-2"></i>Log</button>
              </div>
            </div>
          </form>
          {formMsg.text && <div className={`alert alert-${formMsg.type} py-2 small mt-3 mb-0`}>{formMsg.text}</div>}
        </div>
      )}

      {tab === "workouts" && (
        <div className="wb-card-static p-4">
          <h5 className="fw-bold mb-3 wb-card-title"><i className="bi bi-lightning me-2"></i>Log Workout</h5>
          <form onSubmit={handleAddWorkout}>
            <div className="row g-3">
              <div className="col-md-4">
                <label className="form-label">Exercise Type</label>
                <select className="form-select" value={wType} onChange={e => setWType(e.target.value)}>
                  {EXERCISE_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="col-md-4">
                <label className="form-label">Exercise Name</label>
                <input type="text" className="form-control" value={wName} onChange={e => setWName(e.target.value)} placeholder="e.g. Bench Press" />
              </div>
              <div className="col-md-4">
                <label className="form-label">Date</label>
                <input type="date" className="form-control" value={wDate} onChange={e => setWDate(e.target.value)} />
              </div>
              <div className="col-md-3">
                <label className="form-label">Duration (min)</label>
                <input type="number" className="form-control" value={wDuration} onChange={e => setWDuration(e.target.value)} min="0" />
              </div>
              <div className="col-md-2">
                <label className="form-label">Sets</label>
                <input type="number" className="form-control" value={wSets} onChange={e => setWSets(e.target.value)} min="0" />
              </div>
              <div className="col-md-2">
                <label className="form-label">Reps</label>
                <input type="number" className="form-control" value={wReps} onChange={e => setWReps(e.target.value)} min="0" />
              </div>
              <div className="col-md-3">
                <label className="form-label">Calories</label>
                <input type="number" className="form-control" value={wCals} onChange={e => setWCals(e.target.value)} min="0" />
              </div>
              <div className="col-md-2 d-flex align-items-end">
                <button className="btn btn-wb-primary w-100" type="submit"><i className="bi bi-plus-lg me-2"></i>Log</button>
              </div>
            </div>
          </form>
          {formMsg.text && <div className={`alert alert-${formMsg.type} py-2 small mt-3 mb-0`}>{formMsg.text}</div>}
        </div>
      )}

      {tab === "history" && (
        <div className="row g-4">
          <div className="col-12">
            <DataTable title="Health Metrics History" icon="bi-heart-pulse"
              columns={[
                { key: "date", label: "Date", icon: "bi-calendar3" },
                { key: "metric_type", label: "Type", icon: "bi-tag", render: r => <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">{r.metric_type}</span> },
                { key: "value", label: "Value", icon: "bi-hash", render: r => <span className="fw-bold">{r.value}</span> },
                { key: "unit", label: "Unit" },
                { label: "Actions", render: r => <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deleteHealthMetric(r.id); load(); }}><i className="bi bi-trash"></i></button> },
              ]}
              rows={metrics.slice(0, 20)}
              emptyMessage="No health metrics logged yet."
            />
          </div>
          <div className="col-12">
            <DataTable title="Workout History" icon="bi-lightning"
              columns={[
                { key: "date", label: "Date", icon: "bi-calendar3" },
                { key: "exercise_name", label: "Exercise", icon: "bi-activity" },
                { key: "exercise_type", label: "Type", icon: "bi-tag", render: r => <span className="badge bg-success bg-opacity-10 text-success fw-semibold">{r.exercise_type}</span> },
                { label: "Sets x Reps", render: r => r.sets && r.reps ? `${r.sets} x ${r.reps}` : "—" },
                { key: "duration_min", label: "Duration", render: r => r.duration_min ? `${r.duration_min} min` : "—" },
                { key: "calories_burned", label: "Calories", render: r => r.calories_burned ? `${r.calories_burned} kcal` : "—" },
                { label: "Actions", render: r => <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deleteWorkoutLog(r.id); load(); }}><i className="bi bi-trash"></i></button> },
              ]}
              rows={workouts.slice(0, 20)}
              emptyMessage="No workouts logged yet."
            />
          </div>
        </div>
      )}
    </div>
  );
}
