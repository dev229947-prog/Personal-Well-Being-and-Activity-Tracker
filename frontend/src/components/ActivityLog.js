import React from "react";

export default function ActivityLog({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="wb-card-static p-5 text-center">
        <i className="bi bi-journal-text fs-1 text-muted d-block mb-2"></i>
        <p className="text-muted mb-0">No activities logged yet. Start tracking!</p>
      </div>
    );
  }

  return (
    <div className="wb-card-static p-4">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className="bi bi-table me-2"></i>Activity Log
      </h5>
      <div className="table-responsive">
        <table className="table table-hover align-middle mb-0">
          <thead>
            <tr>
              <th><i className="bi bi-calendar3 me-1"></i>Date</th>
              <th><i className="bi bi-lightning me-1"></i>Activity</th>
              <th><i className="bi bi-hash me-1"></i>Value</th>
              <th><i className="bi bi-person me-1"></i>User</th>
            </tr>
          </thead>
          <tbody>
            {activities.map((a) => (
              <tr key={a.id}>
                <td>{new Date(a.timestamp).toLocaleDateString()}</td>
                <td>
                  <span className="badge bg-primary bg-opacity-10 text-primary fw-semibold">
                    {a.activity_type.charAt(0).toUpperCase() + a.activity_type.slice(1)}
                  </span>
                </td>
                <td className="fw-semibold">{a.value}</td>
                <td>{a.user_name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
