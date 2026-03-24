import React, { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { getNutritionLogs, addNutritionLog, deleteNutritionLog } from "../services/api";
import KPICards from "../components/KPICards";
import DataTable from "../components/DataTable";
import { TrendLineChart, ActivityPieChart } from "../components/Charts";

const MEALS = ["breakfast", "lunch", "dinner", "snack"];

export default function NutritionPage() {
  const { user } = useAuth();
  const uname = user?.username || "guest";
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [meal, setMeal] = useState("breakfast");
  const [desc, setDesc] = useState("");
  const [cals, setCals] = useState("");
  const [protein, setProtein] = useState("");
  const [carbs, setCarbs] = useState("");
  const [fat, setFat] = useState("");
  const [water, setWater] = useState("");

  const load = React.useCallback(async () => {
    try { setLogs(await getNutritionLogs(uname)); } catch (e) { console.error(e); }
    setLoading(false);
  }, [uname]);
  useEffect(() => { load(); }, [load]);

  const today = new Date().toISOString().split("T")[0];
  const todayLogs = logs.filter(l => l.date === today);
  const todayCals = todayLogs.reduce((s, l) => s + (l.calories || 0), 0);
  const todayProtein = todayLogs.reduce((s, l) => s + (l.protein_g || 0), 0);
  const todayCarbs = todayLogs.reduce((s, l) => s + (l.carbs_g || 0), 0);
  const todayFat = todayLogs.reduce((s, l) => s + (l.fat_g || 0), 0);
  const todayWater = todayLogs.reduce((s, l) => s + (l.water_ml || 0), 0);

  const macroPie = useMemo(() => [
    { name: "Protein", value: todayProtein },
    { name: "Carbs", value: todayCarbs },
    { name: "Fat", value: todayFat },
  ].filter(d => d.value > 0), [todayProtein, todayCarbs, todayFat]);

  const mealDist = useMemo(() => {
    const counts = {};
    todayLogs.forEach(l => { counts[l.meal_type] = (counts[l.meal_type] || 0) + (l.calories || 0); });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [todayLogs]);

  const dailyTrend = useMemo(() => {
    const grouped = {};
    logs.forEach(l => {
      if (!grouped[l.date]) grouped[l.date] = { date: l.date, calories: 0, water: 0 };
      grouped[l.date].calories += l.calories || 0;
      grouped[l.date].water += l.water_ml || 0;
    });
    return Object.values(grouped).sort((a, b) => a.date.localeCompare(b.date)).slice(-14);
  }, [logs]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: "", text: "" });
    try {
      await addNutritionLog({
        user_name: uname, date, meal_type: meal, description: desc,
        calories: parseFloat(cals) || 0, protein_g: parseFloat(protein) || 0,
        carbs_g: parseFloat(carbs) || 0, fat_g: parseFloat(fat) || 0,
        water_ml: parseFloat(water) || 0,
      });
      setFormMsg({ type: "success", text: "Meal logged!" });
      setDesc(""); setCals(""); setProtein(""); setCarbs(""); setFat(""); setWater("");
      load();
    } catch (e) { setFormMsg({ type: "danger", text: "Failed to save." }); }
  };

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <h2 className="wb-page-header mb-4"><i className="bi bi-egg-fried me-2"></i>Nutrition & Hydration</h2>

      <KPICards kpis={[
        { icon: "bi-fire", label: "Calories Today", value: todayCals, variant: "danger", progress: Math.min(100, (todayCals / 2000) * 100) },
        { icon: "bi-egg", label: "Protein", value: `${todayProtein}g`, variant: "primary" },
        { icon: "bi-diagram-3", label: "Carbs", value: `${todayCarbs}g`, variant: "accent" },
        { icon: "bi-droplet-half", label: "Fat", value: `${todayFat}g`, variant: "purple" },
        { icon: "bi-droplet-fill", label: "Water", value: `${todayWater}ml`, variant: "info", progress: Math.min(100, (todayWater / 2000) * 100) },
        { icon: "bi-journal-check", label: "Meals Today", value: todayLogs.length, variant: "success" },
      ]} />

      <div className="row g-4 mb-4">
        <div className="col-lg-4"><ActivityPieChart data={macroPie} title="Macronutrient Split" /></div>
        <div className="col-lg-4"><ActivityPieChart data={mealDist} title="Calories by Meal" /></div>
        <div className="col-lg-4">
          <TrendLineChart data={dailyTrend} title="Daily Calories Trend" icon="bi-graph-up"
            lines={[{ key: "calories", label: "Calories", color: "#ef4444" }]}
          />
        </div>
      </div>

      {/* Log Form */}
      <div className="wb-card-static p-4 mb-4">
        <h5 className="fw-bold mb-3 wb-card-title"><i className="bi bi-plus-circle me-2"></i>Log Meal / Water</h5>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-2">
              <label className="form-label">Date</label>
              <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Meal</label>
              <select className="form-select" value={meal} onChange={e => setMeal(e.target.value)}>
                {MEALS.map(m => <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Description</label>
              <input type="text" className="form-control" value={desc} onChange={e => setDesc(e.target.value)} placeholder="What you ate" />
            </div>
            <div className="col-md-1">
              <label className="form-label">Cal</label>
              <input type="number" className="form-control" value={cals} onChange={e => setCals(e.target.value)} min="0" placeholder="kcal" />
            </div>
            <div className="col-md-1">
              <label className="form-label">Protein</label>
              <input type="number" className="form-control" value={protein} onChange={e => setProtein(e.target.value)} min="0" placeholder="g" />
            </div>
            <div className="col-md-1">
              <label className="form-label">Carbs</label>
              <input type="number" className="form-control" value={carbs} onChange={e => setCarbs(e.target.value)} min="0" placeholder="g" />
            </div>
            <div className="col-md-1">
              <label className="form-label">Fat</label>
              <input type="number" className="form-control" value={fat} onChange={e => setFat(e.target.value)} min="0" placeholder="g" />
            </div>
            <div className="col-md-1">
              <label className="form-label">Water</label>
              <input type="number" className="form-control" value={water} onChange={e => setWater(e.target.value)} min="0" placeholder="ml" />
            </div>
            <div className="col-md-1 d-flex align-items-end">
              <button className="btn btn-wb-primary w-100" type="submit"><i className="bi bi-plus-lg"></i></button>
            </div>
          </div>
        </form>
        {formMsg.text && <div className={`alert alert-${formMsg.type} py-2 small mt-3 mb-0`}>{formMsg.text}</div>}
      </div>

      <DataTable title="Nutrition Log" icon="bi-egg-fried"
        columns={[
          { key: "date", label: "Date", icon: "bi-calendar3" },
          { key: "meal_type", label: "Meal", render: r => <span className="badge bg-warning bg-opacity-10 text-warning fw-semibold">{r.meal_type}</span> },
          { key: "description", label: "Food" },
          { key: "calories", label: "Cal", render: r => <span className="fw-bold">{r.calories}</span> },
          { label: "P/C/F", render: r => `${r.protein_g}/${r.carbs_g}/${r.fat_g}g` },
          { key: "water_ml", label: "Water", render: r => r.water_ml ? `${r.water_ml}ml` : "—" },
          { label: "", render: r => <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deleteNutritionLog(r.id); load(); }}><i className="bi bi-trash"></i></button> },
        ]}
        rows={logs.slice(0, 30)}
        emptyMessage="No nutrition data logged yet."
      />
    </div>
  );
}
