
import React, { useMemo } from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell,
  AreaChart, Area, RadarChart, Radar, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis,
} from "recharts";
// ── Gamified Goal Progress Line Chart ──
export function GoalProgressLineChart({ goal }) {
  if (!goal || !goal.milestones || goal.milestones.length === 0) return null;
  const milestones = goal.milestones.sort((a, b) => a.sort_order - b.sort_order);
  // Simulate progress points: each milestone is a step, value is cumulative
  let progress = 0;
  const data = milestones.map((m, i) => {
    if (m.completed) progress += m.target_value || 1;
    return {
      name: m.title,
      value: progress,
      milestone: m.title,
      completed: m.completed,
      idx: i + 1,
      target: m.target_value || 1,
    };
  });
  // Add a final point for the goal target
  data.push({
    name: 'Goal',
    value: goal.target_value,
    milestone: 'Goal',
    completed: progress >= goal.target_value,
    idx: data.length + 1,
    target: goal.target_value,
  });
  return (
    <div className="wb-card-static p-4 h-100">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className="bi bi-graph-up-arrow me-2"></i>Progress Journey
      </h5>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis domain={[0, goal.target_value]} tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} formatter={(val) => `${val} ${goal.unit}`} />
          <Legend />
          <Line type="monotone" dataKey="value" stroke="#6366f1" strokeWidth={3} dot={{ r: 6, stroke: '#10b981', strokeWidth: 2, fill: '#fff' }} />
        </LineChart>
      </ResponsiveContainer>
      <div className="mt-2 text-center">
        <span className="badge bg-success bg-opacity-10 text-success">
          {progress} / {goal.target_value} {goal.unit} complete
        </span>
        <span className="ms-3 badge bg-info bg-opacity-10 text-info">
          {goal.target_value - progress} {goal.unit} left
        </span>
      </div>
    </div>
  );
}

const COLORS = ["#6366f1", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6", "#06b6d4", "#ec4899", "#64748b"];

const tooltipStyle = {
  borderRadius: 12,
  border: "none",
  boxShadow: "0 4px 24px rgba(0,0,0,0.1)",
};

/* ── Activity Distribution Pie Chart ── */
export function ActivityPieChart({ data, title }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="wb-card-static p-4 h-100">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className="bi bi-pie-chart me-2"></i>{title || "Activity Distribution"}
      </h5>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={100}
            paddingAngle={4} dataKey="value" nameKey="name" label={({ name, percent }) =>
              `${name} ${(percent * 100).toFixed(0)}%`
            }
          >
            {data.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Trend Line Chart ── */
export function TrendLineChart({ data, lines, title, icon }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="wb-card-static p-4 h-100">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className={`bi ${icon || "bi-graph-up"} me-2`}></i>{title || "Trends"}
      </h5>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          {(lines || []).map((line, i) => (
            <Line key={line.key} type="monotone" dataKey={line.key}
              stroke={line.color || COLORS[i % COLORS.length]}
              strokeWidth={2} dot={{ r: 3, strokeWidth: 2 }}
              connectNulls
              name={line.label || line.key}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Comparison Bar Chart ── */
export function ComparisonBarChart({ data, bars, title, icon }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="wb-card-static p-4 h-100">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className={`bi ${icon || "bi-bar-chart-fill"} me-2`}></i>{title || "Comparison"}
      </h5>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="name" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          {(bars || []).map((bar, i) => (
            <Bar key={bar.key} dataKey={bar.key}
              fill={bar.color || COLORS[i % COLORS.length]}
              radius={[6, 6, 0, 0]}
              name={bar.label || bar.key}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Area Chart ── */
export function AreaTrendChart({ data, areas, title, icon }) {
  if (!data || data.length === 0) return null;
  return (
    <div className="wb-card-static p-4 h-100">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className={`bi ${icon || "bi-graph-up-arrow"} me-2`}></i>{title || "Area Trend"}
      </h5>
      <ResponsiveContainer width="100%" height={280}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
          <XAxis dataKey="date" tick={{ fontSize: 11 }} />
          <YAxis tick={{ fontSize: 11 }} />
          <Tooltip contentStyle={tooltipStyle} />
          <Legend />
          {(areas || []).map((a, i) => (
            <Area key={a.key} type="monotone" dataKey={a.key}
              fill={a.color || COLORS[i % COLORS.length]}
              fillOpacity={0.15}
              stroke={a.color || COLORS[i % COLORS.length]}
              strokeWidth={2}
              name={a.label || a.key}
            />
          ))}
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Radar Chart (for wellness scores) ── */
export function WellnessRadarChart({ data, title }) {
  if (!data || data.length === 0) return null;
  const avg = data.reduce((s, d) => s + (d.score || 0), 0) / data.length;
  const pct = Math.round(avg * 10); // 0-100
  const hasData = data.some(d => d.score > 0);
  return (
    <div className="wb-card-static p-4 h-100">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="fw-bold mb-0 wb-card-title">
          <i className="bi bi-bullseye me-2"></i>{title || "Wellness Score"}
        </h5>
        <span className="badge rounded-pill fs-6" style={{ background: pct >= 60 ? "#10b981" : pct >= 30 ? "#f59e0b" : "#ef4444", color: "#fff" }}>
          {pct}%
        </span>
      </div>
      {!hasData ? (
        <div className="text-center text-muted py-5">
          <i className="bi bi-heart-pulse" style={{ fontSize: "2.5rem" }}></i>
          <p className="mt-2 mb-0">Log sleep, mood, workouts & nutrition to build your score</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <RadarChart data={data}>
            <PolarGrid stroke="#e2e8f0" />
            <PolarAngleAxis dataKey="metric" tick={{ fontSize: 11 }} />
            <PolarRadiusAxis tick={{ fontSize: 10 }} domain={[0, 10]} />
            <Radar dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.25} strokeWidth={2} />
            <Tooltip contentStyle={tooltipStyle} />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

/* ── Goal Progress Doughnut ── */
export function GoalProgressChart({ goals, title }) {
  const chartData = useMemo(() => {
    if (!goals || goals.length === 0) return [];
    return goals.slice(0, 6).map((g) => ({
      name: g.title,
      value: Math.min(100, Math.round((g.current_value / g.target_value) * 100)),
    }));
  }, [goals]);

  if (chartData.length === 0) return null;

  return (
    <div className="wb-card-static p-4 h-100">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className="bi bi-trophy me-2"></i>{title || "Goal Progress"}
      </h5>
      <ResponsiveContainer width="100%" height={280}>
        <PieChart>
          <Pie data={chartData} cx="50%" cy="50%" innerRadius={65} outerRadius={100}
            paddingAngle={3} dataKey="value" nameKey="name"
            label={({ name, value }) => `${name}: ${value}%`}
          >
            {chartData.map((_, i) => (
              <Cell key={i} fill={COLORS[i % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={tooltipStyle} formatter={(val) => `${val}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}

/* ── Default/Legacy Charts (backward compat) ── */
export default function Charts({ activities }) {
  const chartData = useMemo(() => {
    if (!activities || activities.length === 0) return [];
    const grouped = {};
    activities.forEach((a) => {
      const date = a.date || new Date(a.timestamp || a.createdAt).toLocaleDateString();
      if (!grouped[date]) grouped[date] = { date };
      const key = a.activity_type || a.exercise_type || a.metric_type || "activity";
      grouped[date][key] = (grouped[date][key] || 0) + (a.value || a.duration_min || 1);
    });
    return Object.values(grouped).sort((a, b) => new Date(a.date) - new Date(b.date));
  }, [activities]);

  const activityTypes = useMemo(() => {
    if (!activities) return [];
    return [...new Set(activities.map((a) => a.activity_type || a.exercise_type || a.metric_type || "activity"))];
  }, [activities]);

  if (chartData.length === 0) {
    return (
      <div className="wb-card-static p-5 text-center">
        <i className="bi bi-bar-chart-line fs-1 text-muted d-block mb-2"></i>
        <p className="text-muted mb-0">No data to display charts. Start logging activities!</p>
      </div>
    );
  }

  return (
    <div className="row g-4">
      <div className="col-12">
        <div className="wb-card-static p-4">
          <h5 className="fw-bold mb-3 wb-card-title">
            <i className="bi bi-graph-up me-2"></i>Activity Trends
          </h5>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              {activityTypes.map((type, i) => (
                <Line key={type} type="monotone" dataKey={type}
                  stroke={COLORS[i % COLORS.length]} strokeWidth={3}
                  dot={{ r: 5, strokeWidth: 2 }}
                  name={type.charAt(0).toUpperCase() + type.slice(1)}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="col-12">
        <div className="wb-card-static p-4">
          <h5 className="fw-bold mb-3 wb-card-title">
            <i className="bi bi-bar-chart-fill me-2"></i>Daily Comparison
          </h5>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="date" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend />
              {activityTypes.map((type, i) => (
                <Bar key={type} dataKey={type} fill={COLORS[i % COLORS.length]}
                  radius={[6, 6, 0, 0]}
                  name={type.charAt(0).toUpperCase() + type.slice(1)}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
