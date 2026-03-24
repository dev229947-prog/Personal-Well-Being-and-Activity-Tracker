import React from "react";

export default function StreakTracker({ streaks }) {
  if (!streaks || streaks.length === 0) return null;

  return (
    <div className="wb-card-static p-4">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className="bi bi-fire me-2"></i>Streaks & Milestones
      </h5>
      <div className="row g-3">
        {streaks.map((s, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="text-center p-3 rounded-3" style={{ background: s.active ? "rgba(245,158,11,0.1)" : "rgba(100,116,139,0.08)" }}>
              <div className="fs-1 mb-1">{s.emoji || "🔥"}</div>
              <div className="fw-bold fs-4" style={{ color: s.active ? "var(--wb-accent)" : "var(--wb-muted)" }}>
                {s.count}
              </div>
              <div className="text-muted small">{s.label}</div>
              {s.milestone && (
                <span className="badge bg-warning text-dark mt-1">
                  <i className="bi bi-award me-1"></i>{s.milestone}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
