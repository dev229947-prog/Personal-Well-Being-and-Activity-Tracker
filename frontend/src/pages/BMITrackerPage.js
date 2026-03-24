import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getWeightLogs, addWeightLog, deleteWeightLog } from "../services/api";
import { TrendLineChart } from "../components/Charts";
import KPICards from "../components/KPICards";
import DataTable from "../components/DataTable";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ReferenceLine, Legend,
} from "recharts";

const BMI_RANGES = [
  { label: "Underweight", min: 0, max: 18.5, color: "#3b82f6" },
  { label: "Normal", min: 18.5, max: 25, color: "#10b981" },
  { label: "Overweight", min: 25, max: 30, color: "#f59e0b" },
  { label: "Obese", min: 30, max: 100, color: "#ef4444" },
];

function getBmiCategory(bmi) {
  return BMI_RANGES.find(r => bmi >= r.min && bmi < r.max) || BMI_RANGES[3];
}

// Simple weight projection: based on avg weekly caloric surplus/deficit
// 1 kg ≈ 7700 kcal
function projectWeight(logs, weeks = 12) {
  if (logs.length < 2) return [];
  const recent = logs.slice(-14); // last 14 entries
  let totalSurplus = 0;
  recent.forEach(l => { totalSurplus += (l.calories_in - l.calories_out); });
  const avgDailySurplus = totalSurplus / recent.length;
  const weeklyChange = (avgDailySurplus * 7) / 7700; // kg per week

  const lastLog = logs[logs.length - 1];
  const startWeight = lastLog.weight_kg;
  const startDate = new Date(lastLog.date);
  const points = [{ date: startDate.toISOString().slice(0, 10), Projected: startWeight, label: "Now" }];

  for (let w = 1; w <= weeks; w++) {
    const d = new Date(startDate);
    d.setDate(d.getDate() + w * 7);
    const projected = Math.max(startWeight + weeklyChange * w, 30); // floor at 30kg
    points.push({
      date: d.toISOString().slice(0, 10),
      Projected: parseFloat(projected.toFixed(1)),
      label: `Week ${w}`,
    });
  }
  return { points, weeklyChange, avgDailySurplus };
}

export default function BMITrackerPage() {
  const { user } = useAuth();
  const uname = user?.username || "guest";
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Form state
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [weightKg, setWeightKg] = useState("");
  const [heightCm, setHeightCm] = useState("");
  const [caloriesIn, setCaloriesIn] = useState("");
  const [caloriesOut, setCaloriesOut] = useState("");
  const [goalType, setGoalType] = useState("lose");
  const [targetWeight, setTargetWeight] = useState("");
  const [notes, setNotes] = useState("");
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  const load = async () => {
    try { setLogs(await getWeightLogs(uname)); } catch (e) { console.error(e); }
    setLoading(false);
  };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { load(); }, [uname]);

  // Prefill height from last entry
  useEffect(() => {
    if (logs.length > 0 && !heightCm) {
      setHeightCm(String(logs[logs.length - 1].height_cm));
    }
    if (logs.length > 0 && !targetWeight) {
      const last = logs[logs.length - 1];
      if (last.target_weight) setTargetWeight(String(last.target_weight));
      setGoalType(last.goal_type || "lose");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [logs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: "", text: "" });
    if (!weightKg || !heightCm) {
      setFormMsg({ type: "danger", text: "Weight and height are required." });
      return;
    }
    try {
      await addWeightLog({
        user_name: uname, date, weight_kg: parseFloat(weightKg),
        height_cm: parseFloat(heightCm), calories_in: parseFloat(caloriesIn) || 0,
        calories_out: parseFloat(caloriesOut) || 0, goal_type: goalType,
        target_weight: targetWeight ? parseFloat(targetWeight) : null,
        notes: notes.trim(),
      });
      setFormMsg({ type: "success", text: "Entry logged!" });
      setWeightKg(""); setCaloriesIn(""); setCaloriesOut(""); setNotes("");
      load();
    } catch (e) {
      setFormMsg({ type: "danger", text: "Failed to log entry." });
    }
  };

  const latest = logs.length > 0 ? logs[logs.length - 1] : null;
  const first = logs.length > 0 ? logs[0] : null;
  const weightChange = latest && first ? parseFloat((latest.weight_kg - first.weight_kg).toFixed(1)) : 0;

  const projection = useMemo(() => projectWeight(logs, 12), [logs]);

  // Chart data – weight over time
  const weightTrend = logs.map(l => ({
    date: new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    Weight: l.weight_kg,
    BMI: l.bmi,
  }));

  // Calorie balance chart
  const calorieTrend = logs.slice(-30).map(l => ({
    date: new Date(l.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    "Calories In": l.calories_in,
    "Calories Out": l.calories_out,
    Balance: l.calories_in - l.calories_out,
  }));

  const bmiCat = latest ? getBmiCategory(latest.bmi) : null;

  const kpis = [
    { label: "Current Weight", value: latest ? `${latest.weight_kg} kg` : "—", icon: "bi-speedometer", variant: "primary" },
    { label: "Current BMI", value: latest ? latest.bmi : "—", icon: "bi-heart-pulse", variant: bmiCat?.color === "#10b981" ? "success" : bmiCat?.color === "#f59e0b" ? "accent" : bmiCat?.color === "#ef4444" ? "danger" : "info" },
    { label: "BMI Category", value: bmiCat?.label || "—", icon: "bi-clipboard-data", variant: "purple" },
    { label: "Total Change", value: weightChange !== 0 ? `${weightChange > 0 ? "+" : ""}${weightChange} kg` : "—", icon: weightChange <= 0 ? "bi-arrow-down-circle" : "bi-arrow-up-circle", variant: (latest?.goal_type === "lose" ? weightChange <= 0 : weightChange >= 0) ? "success" : "danger" },
    { label: "Target", value: latest?.target_weight ? `${latest.target_weight} kg` : "—", icon: "bi-bullseye", variant: "accent" },
    { label: "Total Entries", value: logs.length, icon: "bi-journal-text", variant: "info" },
  ];

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <h2 className="wb-page-header mb-4"><i className="bi bi-speedometer me-2"></i>BMI & Weight Tracker</h2>

      <KPICards kpis={kpis} />

      {/* BMI Scale Visual */}
      {latest && (
        <div className="wb-card-static p-4 mb-4">
          <h6 className="fw-bold wb-card-title mb-3"><i className="bi bi-rulers me-2"></i>BMI Scale</h6>
          <div className="d-flex rounded-3 overflow-hidden" style={{ height: 32 }}>
            {BMI_RANGES.map(r => (
              <div key={r.label} className="d-flex align-items-center justify-content-center flex-fill"
                style={{ background: r.color, color: "#fff", fontSize: "0.7rem", fontWeight: 600, opacity: bmiCat?.label === r.label ? 1 : 0.35 }}>
                {r.label}
              </div>
            ))}
          </div>
          <div className="d-flex mt-1">
            {BMI_RANGES.map(r => (
              <div key={r.label} className="flex-fill text-center text-muted" style={{ fontSize: "0.65rem" }}>
                {r.min}–{r.max === 100 ? "40+" : r.max}
              </div>
            ))}
          </div>
          <div className="text-center mt-2">
            <span className="badge fs-6" style={{ background: bmiCat?.color, color: "#fff" }}>
              Your BMI: {latest.bmi} — {bmiCat?.label}
            </span>
          </div>
        </div>
      )}

      {/* Goal Banner */}
      {latest && (() => {
        const dir = latest.target_weight
          ? latest.weight_kg > latest.target_weight ? "lose" : latest.weight_kg < latest.target_weight ? "gain" : "maintain"
          : goalType;
        return (
        <div className="wb-card-static p-4 mb-4" style={{ borderLeft: `4px solid ${dir === "lose" ? "#ef4444" : dir === "gain" ? "#10b981" : "#6366f1"}` }}>
          <div className="row align-items-center">
            <div className="col-md-8">
              <h5 className="fw-bold mb-1">
                <i className={`bi ${dir === "lose" ? "bi-arrow-down-circle text-danger" : dir === "gain" ? "bi-arrow-up-circle text-success" : "bi-dash-circle text-primary"} me-2`}></i>
                {dir === "lose" ? "Weight Loss Mode" : dir === "gain" ? "Weight Gain Mode" : "Maintenance Mode"}
              </h5>
              <p className="text-muted mb-0 small">
                {dir === "lose"
                  ? "You're in a caloric deficit to lose weight. Keep tracking to stay on course!"
                  : dir === "gain"
                  ? "You're in a caloric surplus to gain mass. Consistency is key!"
                  : "You're maintaining your current weight. Stay balanced!"}
              </p>
            </div>
            {latest.target_weight && (
              <div className="col-md-4 text-md-end mt-2 mt-md-0">
                <div className="text-muted small">Distance to target</div>
                <div className="fw-bold fs-4">
                  {Math.abs(latest.weight_kg - latest.target_weight).toFixed(1)} kg
                  <span className="text-muted small ms-1">
                    {dir === "lose" ? "to lose" : dir === "gain" ? "to gain" : "on target"}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
        );
      })()}

      {/* Charts */}
      <div className="row g-4 mb-4">
        <div className="col-lg-6">
          <TrendLineChart
            data={weightTrend}
            lines={[{ key: "Weight", color: "#6366f1" }]}
            title="Weight Trend"
          />
        </div>
        <div className="col-lg-6">
          <TrendLineChart
            data={weightTrend}
            lines={[{ key: "BMI", color: "#f59e0b" }]}
            title="BMI Trend"
          />
        </div>
      </div>

      {/* Calorie Balance */}
      {calorieTrend.length > 0 && (
        <div className="wb-card-static p-4 mb-4">
          <h6 className="fw-bold wb-card-title mb-3"><i className="bi bi-fire me-2"></i>Calorie Balance (last 30 entries)</h6>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={calorieTrend}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="Calories In" stroke="#10b981" fill="#10b98133" />
              <Area type="monotone" dataKey="Calories Out" stroke="#ef4444" fill="#ef444433" />
              <ReferenceLine y={0} stroke="#888" strokeDasharray="3 3" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Weight Projection */}
      {projection && projection.points && (
        <div className="wb-card-static p-4 mb-4">
          <h6 className="fw-bold wb-card-title mb-3"><i className="bi bi-graph-up-arrow me-2"></i>12-Week Weight Projection</h6>
          <div className="row mb-3">
            <div className="col-md-4">
              <div className="p-2 rounded-3 text-center" style={{ background: "rgba(99,102,241,0.06)" }}>
                <div className="text-muted small">Avg Daily Balance</div>
                <div className="fw-bold">{projection.avgDailySurplus > 0 ? "+" : ""}{Math.round(projection.avgDailySurplus)} kcal</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-2 rounded-3 text-center" style={{ background: "rgba(99,102,241,0.06)" }}>
                <div className="text-muted small">Projected Weekly Change</div>
                <div className="fw-bold">{projection.weeklyChange > 0 ? "+" : ""}{projection.weeklyChange.toFixed(2)} kg/wk</div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-2 rounded-3 text-center" style={{ background: "rgba(99,102,241,0.06)" }}>
                <div className="text-muted small">Projected in 12 Weeks</div>
                <div className="fw-bold">{projection.points[projection.points.length - 1].Projected} kg</div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={projection.points}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} domain={["auto", "auto"]} />
              <Tooltip />
              {latest?.target_weight && (
                <ReferenceLine y={latest.target_weight} stroke="#10b981" strokeDasharray="5 5" label={{ value: `Target: ${latest.target_weight}kg`, fill: "#10b981", fontSize: 12 }} />
              )}
              <Area type="monotone" dataKey="Projected" stroke="#6366f1" fill="#6366f133" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
          <p className="text-muted small mt-2 mb-0">
            <i className="bi bi-info-circle me-1"></i>
            Projection is based on your average calorie balance. Actual results depend on metabolism, activity, and other factors.
          </p>
        </div>
      )}

      {/* Log Entry Form */}
      <div className="wb-card-static p-4 mb-4">
        <h5 className="fw-bold mb-3 wb-card-title"><i className="bi bi-plus-circle me-2"></i>Log Weight & Calories</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3 col-6">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="col-md-2 col-6">
              <label className="form-label">Weight (kg)</label>
              <input type="number" className="form-control" value={weightKg} onChange={e => setWeightKg(e.target.value)} step="0.1" min="20" max="500" placeholder="75.0" />
            </div>
            <div className="col-md-2 col-6">
              <label className="form-label">Height (cm)</label>
              <input type="number" className="form-control" value={heightCm} onChange={e => setHeightCm(e.target.value)} step="0.1" min="50" max="300" placeholder="175" />
            </div>
            <div className="col-md-2 col-6">
              <label className="form-label">Calories In</label>
              <input type="number" className="form-control" value={caloriesIn} onChange={e => setCaloriesIn(e.target.value)} min="0" placeholder="2000" />
            </div>
            <div className="col-md-2 col-6">
              <label className="form-label">Calories Out</label>
              <input type="number" className="form-control" value={caloriesOut} onChange={e => setCaloriesOut(e.target.value)} min="0" placeholder="2200" />
            </div>
          </div>
          <div className="row g-3 mt-0">
            <div className="col-md-3">
              <label className="form-label">Goal</label>
              <div className="d-flex gap-1">
                {[
                  { v: "lose", label: "Lose", icon: "bi-arrow-down", color: "danger" },
                  { v: "maintain", label: "Maintain", icon: "bi-dash-lg", color: "primary" },
                  { v: "gain", label: "Gain", icon: "bi-arrow-up", color: "success" },
                ].map(g => (
                  <button key={g.v} type="button"
                    className={`btn btn-sm flex-fill ${goalType === g.v ? `btn-${g.color}` : `btn-outline-${g.color}`}`}
                    onClick={() => setGoalType(g.v)}>
                    <i className={`bi ${g.icon} me-1`}></i>{g.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label">Target Weight (kg)</label>
              <input type="number" className="form-control" value={targetWeight} onChange={e => setTargetWeight(e.target.value)} step="0.1" min="20" placeholder="70" />
            </div>
            <div className="col-md-5">
              <label className="form-label">Notes</label>
              <input type="text" className="form-control" value={notes} onChange={e => setNotes(e.target.value)} placeholder="e.g. Heavy leg day, ate clean..." />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-wb-primary w-100" type="submit"><i className="bi bi-plus-lg me-1"></i>Log</button>
            </div>
          </div>
        </form>
        {formMsg.text && <div className={`alert alert-${formMsg.type} py-2 small mt-3 mb-0`}>{formMsg.text}</div>}

        {/* Quick BMI Calculator */}
        {weightKg && heightCm && (
          <div className="mt-3 p-2 rounded-3 text-center" style={{ background: "rgba(99,102,241,0.06)" }}>
            <span className="text-muted small me-2">Preview BMI:</span>
            <span className="fw-bold">
              {(parseFloat(weightKg) / Math.pow(parseFloat(heightCm) / 100, 2)).toFixed(1)}
            </span>
            <span className="text-muted small ms-2">
              ({getBmiCategory(parseFloat(weightKg) / Math.pow(parseFloat(heightCm) / 100, 2)).label})
            </span>
          </div>
        )}
      </div>

      {/* History Table */}
      <DataTable
        columns={[
          { key: "date", label: "Date", render: v => new Date(v).toLocaleDateString() },
          { key: "weight_kg", label: "Weight", render: v => `${v} kg` },
          { key: "bmi", label: "BMI", render: v => {
            const cat = getBmiCategory(v);
            return <span className="badge" style={{ background: cat.color, color: "#fff" }}>{v} — {cat.label}</span>;
          }},
          { key: "calories_in", label: "Cal In" },
          { key: "calories_out", label: "Cal Out" },
          { key: "goal_type", label: "Goal", render: v => (
            <span className={`badge bg-${v === "lose" ? "danger" : v === "gain" ? "success" : "primary"}`}>
              {v === "lose" ? "↓ Lose" : v === "gain" ? "↑ Gain" : "= Maintain"}
            </span>
          )},
          { key: "notes", label: "Notes" },
          { key: "id", label: "", render: (v) => (
            <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deleteWeightLog(v); load(); }}>
              <i className="bi bi-trash"></i>
            </button>
          )},
        ]}
        data={[...logs].reverse()}
        emptyMessage="No weight logs yet. Start tracking above!"
      />
    </div>
  );
}
