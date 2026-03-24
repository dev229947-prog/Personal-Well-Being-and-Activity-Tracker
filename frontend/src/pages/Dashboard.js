import React, { useEffect, useState, useCallback } from "react";
import { useAuth } from "../context/AuthContext";
import {
  getSleepLogs, getMoodLogs, getNutritionLogs,
  getGoals, getWorkoutLogs, getSchedule, getWeightLogs,
} from "../services/api";
import {
  TrendLineChart, ActivityPieChart, WellnessRadarChart,
} from "../components/Charts";
import GoalProgress from "../components/GoalProgress";

const DAYS = ["Monday","Tuesday","Wednesday","Thursday","Friday","Saturday","Sunday"];

/* helper: current day index (Mon=0 … Sun=6) */
const todayIdx = () => { const d = new Date().getDay(); return d === 0 ? 6 : d - 1; };
/* helper: "HH:MM" from Date */
const nowHHMM = () => { const n = new Date(); return `${String(n.getHours()).padStart(2,"0")}:${String(n.getMinutes()).padStart(2,"0")}`; };


export default function Dashboard() {


  const { user } = useAuth();
  const uname = user?.username || "guest";

  // All hooks at the top
  const [loading, setLoading] = useState(true);
  const [sleep, setSleep] = useState([]);
  const [mood, setMood] = useState([]);
  const [nutrition, setNutrition] = useState([]);
  const [goals, setGoals] = useState([]);
  const [workouts, setWorkouts] = useState([]);
  const [schedule, setSchedule] = useState([]);
  const [weight, setWeight] = useState([]);
  // Remove popup/modal for milestone progress
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  const [refresh, setRefresh] = useState(false);
  /* schedule reminder state */
  const [reminder, setReminder] = useState(null);
  const [reminderDismissed, setReminderDismissed] = useState([]);

  // Now it's safe to use state variables
  const now = nowHHMM();
  const dayI = todayIdx();
  const todayEntries = schedule
    .filter(e => e.day_of_week === dayI)
    .sort((a, b) => (a.start_time || "").localeCompare(b.start_time || ""));

  // Reminder logic as a callback
  const checkReminder = useCallback(() => {
    let found = todayEntries.find(e => e.start_time <= now && e.end_time > now);
    if (!found) found = todayEntries.find(e => e.start_time > now);
    if (found && !reminderDismissed.includes(found.id)) {
      const isCurrent = found.start_time <= now && found.end_time > now;
      setReminder({ ...found, isCurrent });
    } else {
      setReminder(null);
    }
  }, [todayEntries, now, reminderDismissed]);

  // Derived stats for KPI cards (must be after state declarations)
  const avgMood = mood.length
    ? (mood.reduce((s, l) => s + (l.mood_score || 0), 0) / mood.length).toFixed(1)
    : "-";
  const today = new Date().toISOString().slice(0, 10);
  const todayCalories = nutrition.filter(n => (n.date || n.createdAt?.slice(0, 10)) === today)
    .reduce((sum, n) => sum + (n.calories || 0), 0);
  const todayWorkouts = workouts.filter(w => (w.date || w.createdAt?.slice(0, 10)) === today).length;
  const completedGoals = goals.filter(g => g.status === "completed").length;
  const dayIdx = todayIdx();
  const todaySchedule = schedule.filter(e => e.day_of_week === dayIdx);

  /* ── load everything in parallel ── */
  useEffect(() => {
    (async () => {
      try {
        const [sl, mo, nu, go, wo, sc, wt] = await Promise.all([
          getSleepLogs(uname).catch(() => []),
          getMoodLogs(uname).catch(() => []),
          getNutritionLogs(uname).catch(() => []),
          getGoals(uname).catch(() => []),
          getWorkoutLogs(uname).catch(() => []),
          getSchedule(uname).catch(() => []),
          getWeightLogs(uname).catch(() => []),
        ]);
        setSleep(sl);
        setMood(mo);
        setNutrition(nu);
        setGoals(go);
        setWorkouts(wo);
        setSchedule(sc);
        setWeight(wt);
        setLoading(false);
      } catch (e) {
        setLoading(false);
      }
    })();

    checkReminder();
  }, [schedule, reminderDismissed, checkReminder]);

  useEffect(() => {
    if (!schedule.length) return;
    checkReminder();
    const iv = setInterval(checkReminder, 30000);
    return () => clearInterval(iv);
  }, [schedule, checkReminder]);

  /* ── derived stats ── */
  const latestWeight = weight.length ? weight[weight.length - 1] : null;
  const avgSleep = sleep.length
    ? (sleep.reduce((s, l) => s + (l.duration_hours || 0), 0) / sleep.length).toFixed(1)
    : "-";

  const weightTrend = weight.slice(-14).map(l => ({
    date: l.date || new Date(l.createdAt).toLocaleDateString(),
    Weight: l.weight_kg || 0,
    BMI: l.bmi || 0,
  }));

  const workoutPie = (() => {
    const map = {};
    workouts.forEach(w => { const t = w.exercise_type || "other"; map[t] = (map[t] || 0) + 1; });
    return Object.entries(map).map(([name, value]) => ({ name, value }));
  })();

  const wellnessRadar = (() => {
    const metrics = [];
    if (sleep.length) metrics.push({ metric: "Sleep", score: Math.min(10, parseFloat(avgSleep) * 10 / 9) });
    if (mood.length) metrics.push({ metric: "Mood", score: parseFloat(avgMood) });
    if (workouts.length) metrics.push({ metric: "Exercise", score: Math.min(10, workouts.length * 10 / 20) });
    if (goals.length) metrics.push({ metric: "Goals", score: Math.min(10, completedGoals * 10 / Math.max(goals.length, 1)) });
    if (nutrition.length) metrics.push({ metric: "Nutrition", score: Math.min(10, todayCalories > 0 ? 7 : 3) });
    if (schedule.length) metrics.push({ metric: "Routine", score: Math.min(10, todaySchedule.length * 10 / 8) });
    return metrics;
  })();

  // Milestone progress variables
  const allMilestones = goals.flatMap(g => g.milestones || []);
  const totalMilestones = allMilestones.length;
  const doneMilestones = allMilestones.filter(m => m.completed).length;

  // Trends for charts
  const sleepTrend = sleep.slice(-14).map(l => ({
    date: l.date || new Date(l.createdAt).toLocaleDateString(),
    Hours: l.duration_hours || 0,
    Quality: l.quality || 0,
  }));
  const moodTrend = mood.slice(-14).map(l => ({
    date: l.date || new Date(l.createdAt).toLocaleDateString(),
    Mood: l.mood_score || 0,
    Stress: l.stress_level || 0,
    Energy: l.energy_level || 0,
  }));
  const nutritionTrend = nutrition.slice(-14).map(l => ({
    date: l.date || new Date(l.createdAt).toLocaleDateString(),
    Calories: l.calories || 0,
    Protein: l.protein || 0,
  }));

  if (loading) return (
    <div className="container py-5 text-center">
      <div className="spinner-border text-primary" role="status"></div>
      <p className="mt-3 text-muted">Loading dashboard...</p>
    </div>
  );

  return (
    <div className="container py-4 position-relative">

      {/* ══ Schedule Reminder Toast ══ */}
      {reminder && (
        <div className="position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1080 }}>
          <div
            className="toast show shadow-lg border-0"
            style={{
              minWidth: 320,
              borderLeft: `5px solid ${reminder.color || "#6366f1"}`,
              background: "var(--wb-card-bg, #222)",
              color: "var(--wb-card-fg, #fff)",
            }}
          >
            <div
              className="toast-header"
              style={{
                background: `${reminder.color || "#6366f1"}15`,
                color: "var(--wb-card-fg, #fff)",
                borderBottom: "1px solid #444",
              }}
            >
              <i className={`bi ${reminder.isCurrent ? "bi-bell-fill text-warning" : "bi-clock"} me-2`}></i>
              <strong className="me-auto" style={{ color: "var(--wb-card-fg, #fff)" }}>{reminder.isCurrent ? "Current Activity" : "Up Next"}</strong>
              <small style={{ color: "var(--wb-card-fg, #fff)", fontWeight: 600 }}>{reminder.start_time} – {reminder.end_time}</small>
              <button className="btn-close ms-2" onClick={() => {
                setReminderDismissed(prev => [...prev, reminder.id]);
                setReminder(null);
              }}></button>
            </div>
            <div className="toast-body" style={{ color: "var(--wb-card-fg, #fff)" }}>
              <div className="d-flex align-items-center gap-2">
                <div style={{ width: 8, height: 8, borderRadius: "50%", background: reminder.color || "#6366f1" }}></div>
                <strong style={{ color: "var(--wb-card-fg, #fff)" }}>{reminder.title}</strong>
              </div>
              {reminder.notes && <div className="small mt-1" style={{ color: "#bdbdbd" }}>{reminder.notes}</div>}
              <div className="small mt-1" style={{ color: "#bdbdbd" }}>
                <i className="bi bi-calendar3 me-1"></i>{DAYS[reminder.day_of_week]} &bull; {reminder.activity_type}
              </div>
            </div>
          </div>
        </div>
      )}

      <h2 className="wb-page-header mb-4 text-wb-gradient" style={{
        background: 'linear-gradient(90deg, #6366f1, #f59e0b, #10b981, #ec4899, #06b6d4)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 800
      }}>
        Dashboard
      </h2>

      {/* KPI Cards Row
      <div className="row g-3 mb-4">
        {[
          { icon: "bi-moon-stars", colorClass: "text-wb-primary", value: `${avgSleep} hrs`, label: "Avg Sleep" },
          { icon: "bi-emoji-smile", colorClass: "text-wb-success", value: avgMood, label: "Avg Mood" },
          { icon: "bi-fire", colorClass: "text-wb-accent", value: todayCalories, label: "Calories Today" },
          { icon: "bi-lightning-charge", colorClass: "text-wb-danger", value: todayWorkouts, label: "Workouts Today" },
          { icon: "bi-trophy", colorClass: "text-wb-purple", value: `${completedGoals}/${goals.length}`, label: "Goals Done" },
          { icon: "bi-calendar-check", colorClass: "text-wb-pink", value: todaySchedule.length, label: "Today's Tasks" },
          { icon: "bi-speedometer", colorClass: "text-wb-info", value: latestWeight ? latestWeight.bmi : "—", label: "Current BMI" },
          { icon: "bi-arrow-down-up", colorClass: "text-wb-muted", value: latestWeight ? `${latestWeight.weight_kg} kg` : "—", label: "Weight" }
        ].map((s, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="wb-card-static p-3 text-center h-100">
              <i className={`bi ${s.icon} ${s.colorClass}`} style={{ fontSize: "1.5rem" }}></i>
              <div className={`fw-bold fs-5 mt-1 ${s.colorClass}`}>{s.value}</div>
              <div className="text-muted small">{s.label}</div>
            </div>
          </div>
        ))}
      </div> */}

      {/* ══ Today's Schedule Preview ══ */}
      {todaySchedule.length > 0 && (
        <div className="wb-card-static p-4 mb-4">
          <h5 className="fw-bold mb-3 wb-card-title text-wb-accent">
            <i className="bi bi-calendar-day me-2 text-wb-accent"></i>Today's Schedule — {DAYS[todayIdx()]}
          </h5>
          <div className="row g-3 mb-4">
            {[
              { icon: "bi-moon-stars", colorClass: "text-wb-primary", value: `${avgSleep} hrs`, label: "Avg Sleep" },
              { icon: "bi-emoji-smile", colorClass: "text-wb-success", value: avgMood, label: "Avg Mood" },
              { icon: "bi-fire", colorClass: "text-wb-accent", value: todayCalories, label: "Calories Today" },
              { icon: "bi-lightning-charge", colorClass: "text-wb-danger", value: todayWorkouts, label: "Workouts Today" },
              { icon: "bi-trophy", colorClass: "text-wb-purple", value: `${completedGoals}/${goals.length}`, label: "Goals Done" },
              { icon: "bi-calendar-check", colorClass: "text-wb-pink", value: todaySchedule.length, label: "Today's Tasks" },
              { icon: "bi-speedometer", colorClass: "text-wb-info", value: latestWeight ? latestWeight.bmi : "—", label: "Current BMI" },
              { icon: "bi-arrow-down-up", colorClass: "text-wb-muted", value: latestWeight ? `${latestWeight.weight_kg} kg` : "—", label: "Weight" }
            ].map((s, i) => (
              <div className="col-6 col-md-3" key={i}>
                <div className="wb-card-static p-3 text-center h-100">
                  <i className={`bi ${s.icon} ${s.colorClass}`} style={{ fontSize: "1.5rem" }}></i>
                  <div className={`fw-bold fs-5 mt-1 ${s.colorClass}`}>{s.value}</div>
                  <div className="text-muted small">{s.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ Streaks & Milestones ══ */}
      {totalMilestones > 0 && (
        <div className="wb-card-static p-4 mb-4">
          <h5 className="fw-bold mb-3 wb-card-title text-wb-pink">
            <i className="bi bi-flag text-wb-purple"></i> Milestone Progress
          </h5>
          <div className="d-flex align-items-center gap-2 mb-2">
            <span className="badge bg-primary bg-opacity-10 text-primary ms-auto" style={{ fontSize: "0.72rem" }}>
              {doneMilestones}/{totalMilestones} done
            </span>
          </div>
          {/* Overall bar */}
          <div style={{ height: 8, borderRadius: 4, background: "var(--wb-surface, #e2e8f0)", marginBottom: 10 }}>
            <div style={{ width: `${totalMilestones ? (doneMilestones / totalMilestones) * 100 : 0}%`, height: "100%", borderRadius: 4, background: "#8b5cf6", transition: "width .3s" }}></div>
          </div>
          {/* Per-goal breakdown */}
          {goals.filter(g => (g.milestones || []).length > 0).map(g => {
            const ms = g.milestones || [];
            const done = ms.filter(m => m.completed).length;
            return (
              <div key={g.id} className="d-flex align-items-center gap-2 py-1">
                <span className="small flex-fill" style={{ minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{g.title}</span>
                <div style={{ width: 80, height: 6, borderRadius: 3, background: "var(--wb-surface, #e2e8f0)" }}>
                  <div style={{ width: `${ms.length ? (done / ms.length) * 100 : 0}%`, height: "100%", borderRadius: 3, background: done === ms.length ? "#10b981" : "#8b5cf6", transition: "width .3s" }}></div>
                </div>
                {/* <span className="text-muted" style={{ fontSize: "0.72rem", minWidth: 40, textAlign: "right" }}>{done}/{ms.length}</span> */}
              </div>
            );
          })}
        </div>
      )}

      {/* ══ Charts Row 1: Trends ══ */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <TrendLineChart data={sleepTrend}
            lines={[{ key: "Hours", color: "#6366f1" }, { key: "Quality", color: "#10b981" }]}
            title="Sleep Trend (Last 14)" icon="bi-moon-stars" />
        </div>
        <div className="col-lg-6">
          <TrendLineChart data={moodTrend}
            lines={[{ key: "Mood", color: "#10b981" }, { key: "Stress", color: "#ef4444" }, { key: "Energy", color: "#f59e0b" }]}
            title="Mood & Energy Trend" icon="bi-emoji-smile" />
        </div>
      </div>

      {/* ══ Charts Row 2: Nutrition & Weight ══ */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <TrendLineChart data={nutritionTrend}
            lines={[{ key: "Calories", color: "#f59e0b" }, { key: "Protein", color: "#8b5cf6" }]}
            title="Nutrition Trend" icon="bi-egg-fried" />
        </div>
        <div className="col-lg-6">
          <TrendLineChart data={weightTrend}
            lines={[{ key: "Weight", color: "#6366f1" }, { key: "BMI", color: "#ec4899" }]}
            title="Weight & BMI Trend" icon="bi-speedometer" />
        </div>
      </div>

      {/* ══ Charts Row 3: Pie + Radar + Goals ══ */}
      <div className="row g-4 mb-4">
        {workoutPie.length > 0 && (
          <div className="col-lg-4">
            <ActivityPieChart data={workoutPie} title="Workout Types" />
          </div>
        )}
        {wellnessRadar.length >= 3 && (
          <div className="col-lg-4">
            <WellnessRadarChart data={wellnessRadar} title="Wellness Overview" />
          </div>
        )}
        {/* Show a progress bar with milestone markers, KPI, and update progress for each active goal */}
        {goals.filter(g => g.status !== "completed").map(goal => (
          <div className="col-lg-4" key={goal.id}>
            <div className="wb-card-static p-3 mb-3" style={{ borderLeft: `6px solid #6366f1`, borderRadius: 16 }}>
              <div className="fw-bold mb-1" style={{ fontSize: 18 }}>{goal.title}</div>
              <GoalProgress goal={goal} />
            </div>
          </div>
        ))}
      </div>

      {/* ══ Empty state ══ */}
      {!sleep.length && !mood.length && !nutrition.length && !workouts.length && !goals.length && !schedule.length && !weight.length && (
        <div className="wb-card-static p-5 text-center">
          <i className="bi bi-bar-chart-line fs-1 text-muted d-block mb-2"></i>
          <p className="text-muted mb-0">No data yet. Start logging sleep, mood, nutrition, or workouts to see your dashboard come to life!</p>
        </div>
      )}
    </div>
  );
}
