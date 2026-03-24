import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getMoodLogs, addMoodLog, deleteMoodLog } from "../services/api";
import KPICards from "../components/KPICards";
import DataTable from "../components/DataTable";
import { TrendLineChart, WellnessRadarChart, ActivityPieChart } from "../components/Charts";

const MOOD_EMOJIS = ["", "😢", "😞", "😐", "🙂", "😊", "😄", "😁", "🤩", "🥳", "🌟"];

export default function MoodPage() {
  const { user } = useAuth();
  const uname = user?.username || "guest";
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [mood, setMood] = useState(7);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [mindfulness, setMindfulness] = useState("");
  const [notes, setNotes] = useState("");

  const load = async () => {
    try { setLogs(await getMoodLogs(uname)); } catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, [uname, load]);

  const todayLog = logs.find(l => l.date === new Date().toISOString().split("T")[0]);
  const avgMood = logs.length > 0 ? (logs.reduce((s, l) => s + l.mood_score, 0) / logs.length).toFixed(1) : 0;
  const avgStress = logs.length > 0 ? (logs.reduce((s, l) => s + l.stress_level, 0) / logs.length).toFixed(1) : 0;
  const avgEnergy = logs.length > 0 ? (logs.reduce((s, l) => s + l.energy_level, 0) / logs.length).toFixed(1) : 0;
  const totalMindfulness = logs.reduce((s, l) => s + (l.mindfulness_min || 0), 0);

  const trendData = useMemo(() =>
    logs.slice(0, 14).reverse().map(l => ({
      date: l.date, mood: l.mood_score, stress: l.stress_level, energy: l.energy_level,
    })), [logs]);

  const radarData = useMemo(() => [
    { metric: "Mood", score: parseFloat(avgMood) },
    { metric: "Energy", score: parseFloat(avgEnergy) },
    { metric: "Stress (inv)", score: 10 - parseFloat(avgStress) },
    { metric: "Mindfulness", score: Math.min(10, totalMindfulness / Math.max(1, logs.length)) },
    { metric: "Consistency", score: Math.min(10, logs.length / 3) },
  ], [avgMood, avgEnergy, avgStress, totalMindfulness, logs.length]);

  const moodDist = useMemo(() => {
    const buckets = { "Great (8-10)": 0, "Good (6-7)": 0, "Okay (4-5)": 0, "Low (1-3)": 0 };
    logs.forEach(l => {
      if (l.mood_score >= 8) buckets["Great (8-10)"]++;
      else if (l.mood_score >= 6) buckets["Good (6-7)"]++;
      else if (l.mood_score >= 4) buckets["Okay (4-5)"]++;
      else buckets["Low (1-3)"]++;
    });
    return Object.entries(buckets).filter(([_, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [logs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: "", text: "" });
    try {
      await addMoodLog({
        user_name: uname, date, mood_score: parseInt(mood),
        stress_level: parseInt(stress), energy_level: parseInt(energy),
        mindfulness_min: parseFloat(mindfulness) || 0, notes,
      });
      setFormMsg({ type: "success", text: "Mood logged!" });
      setNotes(""); setMindfulness("");
      load();
    } catch (e) { setFormMsg({ type: "danger", text: "Failed to save." }); }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <h2 className="wb-page-header mb-4"><i className="bi bi-emoji-smile me-2"></i>Mental & Emotional Health</h2>

      <KPICards kpis={[
        { icon: "bi-emoji-smile", label: "Today's Mood", value: todayLog ? `${MOOD_EMOJIS[todayLog.mood_score]} ${todayLog.mood_score}/10` : "—", variant: "primary" },
        { icon: "bi-graph-up", label: "Avg Mood", value: `${avgMood}/10`, variant: "success" },
        { icon: "bi-lightning-charge", label: "Avg Energy", value: `${avgEnergy}/10`, variant: "accent" },
        { icon: "bi-exclamation-triangle", label: "Avg Stress", value: `${avgStress}/10`, variant: "danger" },
        { icon: "bi-peace", label: "Total Mindfulness", value: `${totalMindfulness} min`, variant: "purple" },
      ]} />

      <div className="row g-4 mb-4">
        <div className="col-lg-5">
          <WellnessRadarChart data={radarData} title="Wellness Score Overview" />
        </div>
        <div className="col-lg-4">
          <TrendLineChart data={trendData} title="Mood Trends" icon="bi-graph-up"
            lines={[
              { key: "mood", label: "Mood", color: "#6366f1" },
              { key: "stress", label: "Stress", color: "#ef4444" },
              { key: "energy", label: "Energy", color: "#10b981" },
            ]}
          />
        </div>
        <div className="col-lg-3">
          <ActivityPieChart data={moodDist} title="Mood Distribution" />
        </div>
      </div>

      {/* Log Form */}
      <div className="wb-card-static p-4 mb-4">
        <h5 className="fw-bold mb-3 wb-card-title"><i className="bi bi-plus-circle me-2"></i>Log Today's Mood</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Mood (1-10) {MOOD_EMOJIS[mood]}</label>
              <input type="range" className="form-range" min="1" max="10" value={mood} onChange={e => setMood(e.target.value)} />
              <div className="text-center fw-bold text-wb-primary">{mood}</div>
            </div>
            <div className="col-md-2">
              <label className="form-label">Stress (1-10)</label>
              <input type="range" className="form-range" min="1" max="10" value={stress} onChange={e => setStress(e.target.value)} />
              <div className="text-center fw-bold text-wb-danger">{stress}</div>
            </div>
            <div className="col-md-2">
              <label className="form-label">Energy (1-10)</label>
              <input type="range" className="form-range" min="1" max="10" value={energy} onChange={e => setEnergy(e.target.value)} />
              <div className="text-center fw-bold text-wb-success">{energy}</div>
            </div>
            <div className="col-md-2">
              <label className="form-label">Mindfulness (min)</label>
              <input type="number" className="form-control" value={mindfulness} onChange={e => setMindfulness(e.target.value)} min="0" placeholder="0" />
            </div>
            <div className="col-md-2 d-flex align-items-end">
              <button className="btn btn-wb-primary w-100" type="submit"><i className="bi bi-plus-lg me-2"></i>Log</button>
            </div>
          </div>
          <div className="mt-3">
            <label className="form-label">Notes</label>
            <input type="text" className="form-control" value={notes} onChange={e => setNotes(e.target.value)} placeholder="How are you feeling today?" />
          </div>
        </form>
        {formMsg.text && <div className={`alert alert-${formMsg.type} py-2 small mt-3 mb-0`}>{formMsg.text}</div>}
      </div>

      <DataTable title="Mood History" icon="bi-emoji-smile" accentColor="purple"
        columns={[
          { key: "date", label: "Date", icon: "bi-calendar3" },
          { label: "Mood", render: r => {
            const moodColor = r.mood_score >= 8 ? "#10b981" : r.mood_score >= 6 ? "#6366f1" : r.mood_score >= 4 ? "#f59e0b" : "#ef4444";
            return <span className="wb-badge" style={{ background: `${moodColor}18`, color: moodColor }}>{MOOD_EMOJIS[r.mood_score]} <strong>{r.mood_score}</strong>/10</span>;
          }},
          { label: "Stress", render: r => {
            const stressColor = r.stress_level > 7 ? "#ef4444" : r.stress_level > 4 ? "#f59e0b" : "#10b981";
            return <span className="wb-badge" style={{ background: `${stressColor}18`, color: stressColor }}><i className="bi bi-activity me-1"></i>{r.stress_level}/10</span>;
          }},
          { label: "Energy", render: r => {
            const energyColor = r.energy_level >= 7 ? "#10b981" : r.energy_level >= 4 ? "#06b6d4" : "#ef4444";
            return <span className="wb-badge" style={{ background: `${energyColor}18`, color: energyColor }}><i className="bi bi-lightning-charge me-1"></i>{r.energy_level}/10</span>;
          }},
          { label: "Mindfulness", render: r => r.mindfulness_min ? <span className="wb-badge wb-badge-purple"><i className="bi bi-peace me-1"></i>{r.mindfulness_min} min</span> : <span className="text-muted">—</span> },
          { key: "notes", label: "Notes" },
          { label: "", render: r => <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deleteMoodLog(r.id); load(); }}><i className="bi bi-trash"></i></button> },
        ]}
        rows={logs.slice(0, 30)}
        emptyMessage="No mood data logged yet."
      />
    </div>
  );
}
