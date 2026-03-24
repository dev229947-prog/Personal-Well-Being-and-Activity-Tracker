import React from "react";

const KPI_STYLES = {
  primary:  { color: "var(--wb-primary)",  bg: "rgba(99,102,241,0.1)" },
  success:  { color: "var(--wb-success)",  bg: "rgba(16,185,129,0.1)" },
  accent:   { color: "var(--wb-accent)",   bg: "rgba(245,158,11,0.1)" },
  danger:   { color: "var(--wb-danger)",   bg: "rgba(239,68,68,0.1)" },
  purple:   { color: "var(--wb-purple)",   bg: "rgba(139,92,246,0.1)" },
  info:     { color: "var(--wb-info)",     bg: "rgba(6,182,212,0.1)" },
};

export default function KPICards({ kpis }) {
  if (!kpis || kpis.length === 0) return null;

  return (
    <div className="row g-3 mb-4">
      {kpis.map((kpi, i) => {
        const style = KPI_STYLES[kpi.variant || "primary"];
        return (
          <div className={`col-6 col-md-4 col-xl-${Math.max(2, Math.floor(12 / kpis.length))}`} key={i}>
            <div className="wb-stat-card p-3 h-100">
              <div className="d-flex align-items-center gap-3">
                <div
                  className="d-flex align-items-center justify-content-center rounded-3"
                  style={{ width: 48, height: 48, background: style.bg, flexShrink: 0 }}
                >
                  <i className={`bi ${kpi.icon} fs-4`} style={{ color: style.color }}></i>
                </div>
                <div className="flex-fill">
                  <div className="fw-bold fs-4" style={{ color: style.color, lineHeight: 1.2 }}>{kpi.value}</div>
                  <div className="text-muted small">{kpi.label}</div>
                </div>
              </div>
              {kpi.change !== undefined && (
                <div className="mt-2 small">
                  <span className={kpi.change >= 0 ? "text-success" : "text-danger"}>
                    <i className={`bi ${kpi.change >= 0 ? "bi-arrow-up" : "bi-arrow-down"} me-1`}></i>
                    {Math.abs(kpi.change)}%
                  </span>
                  <span className="text-muted ms-1">vs last week</span>
                </div>
              )}
              {kpi.progress !== undefined && (
                <div className="progress mt-2" style={{ height: 5 }}>
                  <div
                    className="progress-bar"
                    style={{ width: `${Math.min(100, kpi.progress)}%`, background: style.color }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
