import React, { useState } from "react";
import { getInsight } from "../services/api";

const ACTIVITY_TYPES = ["sleep", "coffee", "exercise", "meditation", "breaks"];

export default function InsightsPanel({ activityType: propType, value: propValue }) {
  const [activityType, setActivityType] = useState(propType || "sleep");
  const [value, setValue] = useState(propValue || "");
  const [insight, setInsight] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchInsight = async () => {
    if (!value || isNaN(value)) {
      setError("Please enter a valid number.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const data = await getInsight(activityType, parseFloat(value));
      setInsight(data.insight);
    } catch (err) {
      setError("Failed to fetch insight. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="wb-card-static p-4">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className="bi bi-lightbulb me-2"></i>Get Personalized Insight
      </h5>

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
          <i className="bi bi-123 me-1"></i>Value
        </label>
        <input
          type="number"
          className="form-control"
          min="0"
          step="0.5"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Enter value"
        />
      </div>

      <button className="btn btn-wb-accent w-100" onClick={fetchInsight} disabled={loading}>
        {loading ? (
          <><span className="spinner-border spinner-border-sm me-2"></span>Loading...</>
        ) : (
          <><i className="bi bi-stars me-2"></i>Get Insight</>
        )}
      </button>

      {error && (
        <div className="alert alert-danger py-2 small mt-3">
          <i className="bi bi-exclamation-triangle me-1"></i>{error}
        </div>
      )}

      {insight && (
        <div className="wb-insight-card p-4 mt-3">
          <h6 className="fw-bold text-wb-accent">
            <i className="bi bi-lightbulb-fill me-2"></i>Insight
          </h6>
          <p className="mb-0">{insight}</p>
        </div>
      )}
    </div>
  );
}
