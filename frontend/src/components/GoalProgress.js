import React from "react";

const CATEGORY_ICONS = {
  fitness: "bi-heart-pulse",
  nutrition: "bi-egg-fried",
  sleep: "bi-moon-stars",
  mental: "bi-peace",
  general: "bi-star",
};
const CATEGORY_COLORS = {
  fitness: "#10b981", nutrition: "#f59e0b", sleep: "#6366f1", mental: "#8b5cf6", general: "#06b6d4",
};

export default function GoalProgress({ goal }) {
  if (!goal) return null;
  const cat = goal.category || "general";
  const color = CATEGORY_COLORS[cat] || "#6366f1";
  const milestones = (goal.milestones || []).sort((a, b) => a.sort_order - b.sort_order);
  const totalMs = milestones.length;
  if (totalMs === 0) return null;

  // Flexible progress: sum of completed milestone values vs goal target_value
  const completedValue = milestones.filter(m => m.completed).reduce((sum, m) => sum + (m.target_value || 0), 0);
  const pct = goal.target_value > 0 ? Math.round((completedValue / goal.target_value) * 100) : 0;
  const left = Math.max(0, goal.target_value - completedValue);

  return (
    <div className="goal-ms-progress">
      <div className="goal-ms-bar-wrap mb-3">
        <div className="d-flex justify-content-between align-items-center mb-1">
          <span className="goal-ms-pct-label">
            <i className={`bi ${CATEGORY_ICONS[cat]} me-1`} style={{ color }}></i>
            {completedValue} / {goal.target_value} {goal.unit}
          </span>
          <span className="goal-ms-pct-num" style={{ color }}>{pct}%</span>
        </div>
        <div style={{ position: "relative", height: 32 }}>
          <div className="goal-ms-bar" style={{ height: 10, marginTop: 12, marginBottom: 10 }}>
            <div className="goal-ms-bar-fill" style={{ width: `${Math.min(100, pct)}%`, background: color, height: 10 }}></div>
          </div>
        </div>
      </div>
      {/* Show milestones reached, no button */}
      <ul className="list-unstyled mb-1">
        {milestones.map((m, idx) => {
          // Try to extract week/period info from title
          let weekMatch = m.title.match(/week\s*(\d+)/i);
          let label = m.title;
          if (weekMatch) {
            // Remove duplicate 'Week X' from title if present
            label = `Week ${weekMatch[1]}: ` + m.title.replace(/week\s*\d+/i, '').replace(/^[\s:\-]+/, '');
            // Remove duplicate if already starts with 'Run 7 km a week'
            label = label.replace(/^(Run [^:]+: )?/, '');
            label = `Week ${weekMatch[1]}: Run ${m.target_value} ${goal.unit}`;
          } else if (/^run/i.test(m.title)) {
            // For generic run goals, just show the title
            label = m.title;
          }
          return (
            <li key={m.id} className="d-flex align-items-center gap-2 small" style={{ opacity: m.completed ? 1 : 0.5 }}>
              <i className={`bi ${m.completed ? "bi-check-circle-fill text-success" : "bi-circle"}`}></i>
              {label}
            </li>
          );
        })}
      </ul>
      <div className="text-muted small mt-1">
        {left > 0
          ? `${left} ${goal.unit} left to reach your goal`
          : `Goal completed!`}
      </div>
    </div>
  );
}
