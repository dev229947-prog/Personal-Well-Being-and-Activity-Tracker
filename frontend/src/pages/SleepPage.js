import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getSleepLogs, addSleepLog, deleteSleepLog } from "../services/api";
import KPICards from "../components/KPICards";
import DataTable from "../components/DataTable";
import { TrendLineChart, AreaTrendChart, ActivityPieChart } from "../components/Charts";

const QUALITY_LABELS = ["", "Very Poor", "Poor", "Fair", "Good", "Excellent"];

export default function SleepPage() {
  const { user } = useAuth();
  const uname = user?.username || "guest";
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [hours, setHours] = useState("");
  const [quality, setQuality] = useState(3);
  const [rem, setRem] = useState("");
  const [deep, setDeep] = useState("");
  const [light, setLight] = useState("");
  const [notes, setNotes] = useState("");

  const load = React.useCallback(async () => {
    try { setLogs(await getSleepLogs(uname)); } catch (e) { console.error(e); }
    setLoading(false);
  }, [uname]);
  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().split("T")[0];
  const lastNight = logs.find(l => l.date === today);
  const avgHours = logs.length > 0 ? (logs.reduce((s, l) => s + l.hours, 0) / logs.length).toFixed(1) : 0;
  const avgQuality = logs.length > 0 ? (logs.reduce((s, l) => s + l.quality, 0) / logs.length).toFixed(1) : 0;
  const weekLogs = logs.filter(l => new Date(l.date) >= new Date(Date.now() - 7 * 86400000));
  const weekAvg = weekLogs.length > 0 ? (weekLogs.reduce((s, l) => s + l.hours, 0) / weekLogs.length).toFixed(1) : 0;

  const trendData = useMemo(() =>
    logs.slice(0, 14).reverse().map(l => ({
      date: l.date,
      hours: l.hours,
      quality: l.quality,
    })), [logs]);

  const stagesData = useMemo(() =>
    logs.slice(0, 14).reverse().map(l => ({
      date: l.date,
      REM: l.rem_hours || 0,
      Deep: l.deep_hours || 0,
      Light: l.light_hours || 0,
    })), [logs]);

  const qualityDist = useMemo(() => {
    const counts = { "Excellent": 0, "Good": 0, "Fair": 0, "Poor": 0, "Very Poor": 0 };
    logs.forEach(l => { counts[QUALITY_LABELS[l.quality] || "Fair"]++; });
    return Object.entries(counts).filter(([_, v]) => v > 0).map(([name, value]) => ({ name, value }));
  }, [logs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: "", text: "" });
    if (!hours || isNaN(hours)) { setFormMsg({ type: "danger", text: "Enter valid hours" }); return; }
    try {
      await addSleepLog({
        user_name: uname, date, hours: parseFloat(hours), quality: parseInt(quality),
        rem_hours: parseFloat(rem) || 0, deep_hours: parseFloat(deep) || 0,
        light_hours: parseFloat(light) || 0, notes,
      });
      setFormMsg({ type: "success", text: "Sleep logged!" });
      setHours(""); setRem(""); setDeep(""); setLight(""); setNotes("");
      load();
    } catch (e) { setFormMsg({ type: "danger", text: "Failed to save." }); }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <h2 className="wb-page-header mb-4"><i className="bi bi-moon-stars me-2"></i>Sleep Analysis</h2>

      <KPICards kpis={[
        { icon: "bi-moon-stars", label: "Last Night", value: lastNight ? `${lastNight.hours}h` : "—", variant: "primary" },
        { icon: "bi-clock-history", label: "Avg Sleep", value: `${avgHours}h`, variant: "info" },
        { icon: "bi-star-half", label: "Avg Quality", value: `${avgQuality}/5`, variant: "accent" },
        { icon: "bi-calendar-week", label: "Weekly Avg", value: `${weekAvg}h`, variant: "success" },
        { icon: "bi-journal", label: "Total Logs", value: logs.length, variant: "purple" },
      ]} />

      <div className="row g-4 mb-4">
        <div className="col-lg-8">
          <TrendLineChart data={trendData} title="Sleep Duration & Quality" icon="bi-graph-up"
            lines={[
              { key: "hours", label: "Hours", color: "#6366f1" },
              { key: "quality", label: "Quality (1-5)", color: "#f59e0b" },
            ]}
          />
        </div>
        <div className="col-lg-4">
          <ActivityPieChart data={qualityDist} title="Sleep Quality Distribution" />
        </div>
      </div>

      <div className="row g-4 mb-4">
        <div className="col-12">
          <AreaTrendChart data={stagesData} title="Sleep Stages (Last 14 Nights)" icon="bi-layers"
            areas={[
              { key: "REM", label: "REM", color: "#8b5cf6" },
              { key: "Deep", label: "Deep", color: "#6366f1" },
              { key: "Light", label: "Light", color: "#06b6d4" },
            ]}
          />
        </div>
      </div>

      {/* Log Form */}
      <div className="wb-card-static p-4 mb-4">
        <h5 className="fw-bold mb-3 wb-card-title"><i className="bi bi-plus-circle me-2"></i>Log Sleep</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Hours</label>
              <input type="number" className="form-control" value={hours} onChange={e => setHours(e.target.value)} min="0" max="24" step="0.5" placeholder="7.5" />
            </div>
            <div className="col-md-2">
              <label className="form-label">Quality</label>
              <select className="form-select" value={quality} onChange={e => setQuality(e.target.value)}>
                {[1,2,3,4,5].map(q => <option key={q} value={q}>{q} — {QUALITY_LABELS[q]}</option>)}
              </select>
            </div>
            <div className="col-md-1">
              <label className="form-label">REM</label>
              <input type="number" className="form-control" value={rem} onChange={e => setRem(e.target.value)} min="0" step="0.5" placeholder="h" />
            </div>
            <div className="col-md-1">
              <label className="form-label">Deep</label>
              <input type="number" className="form-control" value={deep} onChange={e => setDeep(e.target.value)} min="0" step="0.5" placeholder="h" />
            </div>
            <div className="col-md-1">
              <label className="form-label">Light</label>
              <input type="number" className="form-control" value={light} onChange={e => setLight(e.target.value)} min="0" step="0.5" placeholder="h" />
            </div>
            <div className="col-md-2">
              <label className="form-label">Notes</label>
              <input type="text" className="form-control" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Optional" />
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button className="btn btn-wb-primary w-100" type="submit"><i className="bi bi-plus-lg"></i></button>
            </div>
          </div>
        </form>
        {formMsg.text && <div className={`alert alert-${formMsg.type} py-2 small mt-3 mb-0`}>{formMsg.text}</div>}
      </div>

      <DataTable title="Sleep Log History" icon="bi-moon-stars"
        columns={[
          { key: "date", label: "Date", icon: "bi-calendar3" },
          { key: "hours", label: "Hours", render: r => <span className="fw-bold">{r.hours}h</span> },
          { key: "quality", label: "Quality", render: r => <span className={`badge ${r.quality >= 4 ? "bg-success" : r.quality >= 3 ? "bg-warning" : "bg-danger"} bg-opacity-10 ${r.quality >= 4 ? "text-success" : r.quality >= 3 ? "text-warning" : "text-danger"}`}>{QUALITY_LABELS[r.quality]}</span> },
          { label: "REM", render: r => r.rem_hours ? `${r.rem_hours}h` : "—" },
          { label: "Deep", render: r => r.deep_hours ? `${r.deep_hours}h` : "—" },
          { label: "Light", render: r => r.light_hours ? `${r.light_hours}h` : "—" },
          { label: "", render: r => <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deleteSleepLog(r.id); load(); }}><i className="bi bi-trash"></i></button> },
        ]}
        rows={logs.slice(0, 30)}
        emptyMessage="No sleep data logged yet."
      />
    </div>
  );
}
