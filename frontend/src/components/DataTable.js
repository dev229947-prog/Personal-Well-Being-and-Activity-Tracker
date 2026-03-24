import React from "react";

export default function DataTable({ title, icon, columns, rows, emptyMessage, accentColor }) {
  const accent = accentColor || "primary";
  const accentColors = {
    primary: { gradient: "linear-gradient(135deg, #6366f1, #8b5cf6)", soft: "rgba(99,102,241,0.06)" },
    success: { gradient: "linear-gradient(135deg, #10b981, #06b6d4)", soft: "rgba(16,185,129,0.06)" },
    accent: { gradient: "linear-gradient(135deg, #f59e0b, #ef4444)", soft: "rgba(245,158,11,0.06)" },
    danger: { gradient: "linear-gradient(135deg, #ef4444, #ec4899)", soft: "rgba(239,68,68,0.06)" },
    purple: { gradient: "linear-gradient(135deg, #8b5cf6, #6366f1)", soft: "rgba(139,92,246,0.06)" },
    info: { gradient: "linear-gradient(135deg, #06b6d4, #6366f1)", soft: "rgba(6,182,212,0.06)" },
  };
  const colors = accentColors[accent] || accentColors.primary;

  return (
    <div className="wb-card-static p-4" style={{ borderTop: "none" }}>
      <div style={{
        position: "absolute", top: 0, left: 0, right: 0, height: "3px",
        background: colors.gradient, borderRadius: "var(--wb-radius) var(--wb-radius) 0 0"
      }} />
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className={`bi ${icon || "bi-table"} me-2`}></i>{title || "Data Table"}
      </h5>
      {(!rows || rows.length === 0) ? (
        <div className="text-center py-4 text-muted">
          <i className="bi bi-inbox fs-1 d-block mb-2"></i>
          <p className="mb-0">{emptyMessage || "No data to display."}</p>
        </div>
      ) : (
        <div className="table-responsive" style={{ borderRadius: "var(--wb-radius-sm)", overflow: "hidden" }}>
          <table className="table table-hover align-middle mb-0">
            <thead>
              <tr>
                {columns.map((col, i) => (
                  <th key={i} style={{
                    background: colors.gradient,
                    color: "#fff",
                    fontWeight: 600,
                    padding: "0.75rem 1rem",
                    border: "none",
                    ...(col.width ? { width: col.width } : {})
                  }}>
                    {col.icon && <i className={`bi ${col.icon} me-1`}></i>}
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((row, rIdx) => (
                <tr key={row.id || rIdx} style={rIdx % 2 === 1 ? { backgroundColor: colors.soft } : {}}>
                  {columns.map((col, cIdx) => (
                    <td key={cIdx} style={{ padding: "0.7rem 1rem" }}>
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
