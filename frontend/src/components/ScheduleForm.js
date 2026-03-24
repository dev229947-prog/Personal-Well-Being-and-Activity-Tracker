import React, { useState } from "react";
import { addScheduleEntry, updateScheduleEntry } from "../services/api";
import { useAuth } from "../context/AuthContext";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];

const ACTIVITY_TYPES = [
  { value: "study", label: "Study", icon: "bi-book", color: "#6366f1" },
  { value: "gym", label: "Gym / Workout", icon: "bi-heart-pulse", color: "#10b981" },
  { value: "work", label: "Work", icon: "bi-briefcase", color: "#f59e0b" },
  { value: "meeting", label: "Meeting", icon: "bi-people", color: "#8b5cf6" },
  { value: "break", label: "Break", icon: "bi-cup-hot", color: "#ef4444" },
  { value: "personal", label: "Personal", icon: "bi-person-heart", color: "#06b6d4" },
  { value: "reading", label: "Reading", icon: "bi-journal-text", color: "#ec4899" },
  { value: "commute", label: "Commute", icon: "bi-bus-front", color: "#64748b" },
  { value: "other", label: "Other", icon: "bi-three-dots", color: "#78716c" },
];

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f59e0b",
  "#10b981", "#06b6d4", "#3b82f6", "#64748b", "#78716c",
];

export default function ScheduleForm({ onSave, editEntry, onCancel }) {
  const { user } = useAuth();
  const isEditing = !!editEntry;

  const [title, setTitle] = useState(editEntry?.title || "");
  const [activityType, setActivityType] = useState(editEntry?.activity_type || "study");
  const [dayOfWeek, setDayOfWeek] = useState(editEntry?.day_of_week ?? 0);
  const [startTime, setStartTime] = useState(editEntry?.start_time || "09:00");
  const [endTime, setEndTime] = useState(editEntry?.end_time || "10:00");
  const [color, setColor] = useState(editEntry?.color || "#6366f1");
  const [notes, setNotes] = useState(editEntry?.notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTypeChange = (type) => {
    setActivityType(type);
    const found = ACTIVITY_TYPES.find((t) => t.value === type);
    if (found) setColor(found.color);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!title.trim()) {
      setError("Please enter a title for this activity.");
      return;
    }
    if (startTime >= endTime) {
      setError("End time must be after start time.");
      return;
    }

    setLoading(true);
    try {
      const data = {
        user_name: user?.username || "guest",
        title: title.trim(),
        activity_type: activityType,
        day_of_week: dayOfWeek,
        start_time: startTime,
        end_time: endTime,
        color,
        notes: notes.trim(),
      };

      let saved;
      if (isEditing) {
        saved = await updateScheduleEntry(editEntry.id, data);
        setSuccess("Schedule entry updated!");
      } else {
        saved = await addScheduleEntry(data);
        setSuccess("Activity added to schedule!");
        // Reset form
        setTitle("");
        setNotes("");
        setStartTime("09:00");
        setEndTime("10:00");
      }
      if (onSave) onSave(saved);
    } catch (err) {
      setError("Failed to save. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="wb-card-static p-4">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className={`bi ${isEditing ? "bi-pencil-square" : "bi-plus-circle"} me-2`}></i>
        {isEditing ? "Edit Schedule Entry" : "Add to Schedule"}
      </h5>

      <form onSubmit={handleSubmit}>
        {/* Title */}
        <div className="mb-3">
          <label className="form-label">
            <i className="bi bi-type me-1"></i>Activity Title
          </label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder='e.g. "Morning Gym", "CS101 Lecture", "Team Standup"'
            required
          />
        </div>

        {/* Activity Type */}
        <div className="mb-3">
          <label className="form-label">
            <i className="bi bi-tag me-1"></i>Activity Type
          </label>
          <div className="d-flex flex-wrap gap-2">
            {ACTIVITY_TYPES.map((type) => (
              <button
                key={type.value}
                type="button"
                className={`btn btn-sm ${activityType === type.value ? "text-white" : "btn-outline-secondary"}`}
                style={activityType === type.value ? { background: type.color, borderColor: type.color } : {}}
                onClick={() => handleTypeChange(type.value)}
              >
                <i className={`bi ${type.icon} me-1`}></i>{type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Day of Week */}
        <div className="mb-3">
          <label className="form-label">
            <i className="bi bi-calendar-week me-1"></i>Day of Week
          </label>
          <select
            className="form-select"
            value={dayOfWeek}
            onChange={(e) => setDayOfWeek(parseInt(e.target.value))}
          >
            {DAYS.map((day, i) => (
              <option key={i} value={i}>{day}</option>
            ))}
          </select>
        </div>

        {/* Time Range */}
        <div className="row mb-3">
          <div className="col-6">
            <label className="form-label">
              <i className="bi bi-clock me-1"></i>Start Time
            </label>
            <input
              type="time"
              className="form-control"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              required
            />
          </div>
          <div className="col-6">
            <label className="form-label">
              <i className="bi bi-clock-history me-1"></i>End Time
            </label>
            <input
              type="time"
              className="form-control"
              value={endTime}
              onChange={(e) => setEndTime(e.target.value)}
              required
            />
          </div>
        </div>

        {/* Color */}
        <div className="mb-3">
          <label className="form-label">
            <i className="bi bi-palette me-1"></i>Color
          </label>
          <div className="d-flex gap-2">
            {COLORS.map((c) => (
              <button
                key={c}
                type="button"
                className="btn p-0 border-0"
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  background: c,
                  outline: color === c ? "3px solid var(--wb-text)" : "none",
                  outlineOffset: 2,
                }}
                onClick={() => setColor(c)}
              />
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="mb-3">
          <label className="form-label">
            <i className="bi bi-sticky me-1"></i>Notes (optional)
          </label>
          <textarea
            className="form-control"
            rows="2"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any extra details..."
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

        <div className="d-flex gap-2">
          <button type="submit" className="btn btn-wb-primary flex-fill" disabled={loading}>
            {loading ? (
              <><span className="spinner-border spinner-border-sm me-2"></span>Saving...</>
            ) : isEditing ? (
              <><i className="bi bi-check-lg me-2"></i>Update Entry</>
            ) : (
              <><i className="bi bi-plus-lg me-2"></i>Add to Schedule</>
            )}
          </button>
          {isEditing && onCancel && (
            <button type="button" className="btn btn-outline-secondary" onClick={onCancel}>
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
