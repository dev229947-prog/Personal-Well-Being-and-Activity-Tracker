import React, { useState } from "react";
import { addActivity } from "../services/api";
import { useAuth } from "../context/AuthContext";

const ACTIVITY_TYPES = ["sleep", "coffee", "exercise", "meditation", "breaks"];

export default function ActivityForm({ onAdd }) {
  const { user } = useAuth();
  const [activityType, setActivityType] = useState("sleep");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!value || isNaN(value) || Number(value) < 0) {
      setError("Please enter a valid positive number.");
      return;
    }

    setLoading(true);
    try {
      const activity = await addActivity(
        user?.username || "guest",
        activityType,
        parseFloat(value)
      );
      setSuccess("Activity logged successfully!");
      setValue("");
      if (onAdd) onAdd(activity);
    } catch (err) {
      setError("Failed to log activity. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="wb-card-static p-4">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className="bi bi-journal-plus me-2"></i>Log an Activity
      </h5>

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">
            <i className="bi bi-person me-1"></i>Your Name
          </label>
          <input
            type="text"
            className="form-control"
            value={user?.username || "guest"}
            readOnly
          />
        </div>

        <div className="mb-3">
          <label className="form-label">
            <i className="bi bi-list-check me-1"></i>Activity Type
          </label>
          <select
            className="form-select"
            value={activityType}
            onChange={(e) => setActivityType(e.target.value)}
          >
            {ACTIVITY_TYPES.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-3">
          <label className="form-label">
            <i className="bi bi-123 me-1"></i>Value{" "}
            <small className="text-muted">
              ({activityType === "sleep"
                ? "hours"
                : activityType === "coffee"
                ? "cups"
                : activityType === "exercise"
                ? "minutes"
                : activityType === "meditation"
                ? "minutes"
                : "count"})
            </small>
          </label>
          <input
            type="number"
            className="form-control"
            min="0"
            step="0.5"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="e.g. 7"
          />
        </div>

        {error && (
          <div className="alert alert-danger py-2 small">
            <i className="bi bi-exclamation-triangle me-1"></i>{error}
          </div>
        )}
        {success && (
          <div className="alert alert-success py-2 small">
            <i className="bi bi-check-circle me-1"></i>{success}
          </div>
        )}

        <button type="submit" className="btn btn-wb-primary w-100" disabled={loading}>
          {loading ? (
            <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
          ) : (
            <><i className="bi bi-save me-2"></i>Log Activity</>
          )}
        </button>
      </form>
    </div>
  );
}
