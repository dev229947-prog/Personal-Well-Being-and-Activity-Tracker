import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { recordTaskCompletion } from "../services/api";
import { deleteScheduleEntry } from "../services/api";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const HOURS = Array.from({ length: 17 }, (_, i) => i + 6); // 6 AM to 10 PM

export default function WeeklySchedule({ entries, onEdit, onRefresh, currentActivity }) {
  const [deleting, setDeleting] = useState(null);
  const [activePopup, setActivePopup] = useState(null);
  const { user } = useAuth();

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this schedule entry?")) return;
    setDeleting(id);
    try {
      // If the deleted entry is the current activity, record as not completed
      if (currentActivity && currentActivity.id === id && user?.username) {
        try {
          await recordTaskCompletion({
            user_name: user.username,
            schedule_entry_id: id,
            date: new Date().toISOString().slice(0, 10),
            completed: false,
            title: currentActivity.title,
            deleted: true
          });
        } catch {}
      }
      await deleteScheduleEntry(id);
      setActivePopup(null);
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error("Failed to delete:", err);
    }
    setDeleting(null);
  };

  // Group entries by day
  const entriesByDay = {};
  DAYS.forEach((_, i) => {
    entriesByDay[i] = (entries || []).filter((e) => e.day_of_week === i);
  });

  const timeToMinutes = (time) => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const todayIndex = (new Date().getDay() + 6) % 7;

  return (
    <div className="wb-card-static p-4">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className="bi bi-calendar-week me-2"></i>Weekly Schedule
      </h5>

      {/* ── Desktop Grid View ── */}
      <div className="d-none d-lg-block">
        <div className="sch-grid" style={{ display: "grid", gridTemplateColumns: "60px repeat(7, 1fr)", gap: 0 }}>

          {/* Header Row */}
          <div className="sch-corner"></div>
          {DAYS.map((day, i) => (
            <div key={day} className={`sch-day-hdr ${i === todayIndex ? "sch-today-hdr" : ""}`}>
              {day.slice(0, 3)}
              {i === todayIndex && <span className="sch-today-badge">Today</span>}
            </div>
          ))}

          {/* Time column + 7 day columns */}
          <div className="sch-time-col">
            {HOURS.map(h => (
              <div key={h} className="sch-time-label">
                {h.toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {DAYS.map((day, dayIdx) => {
            const dayEntries = entriesByDay[dayIdx].slice().sort((a, b) =>
              (a.start_time || "").localeCompare(b.start_time || "")
            );
            return (
              <div key={day} className={`sch-day-col ${dayIdx === todayIndex ? "sch-today-col" : ""}`}>
                {HOURS.map(h => (
                  <div key={h} className="sch-hour-line" />
                ))}

                {dayEntries.map(entry => {
                  const startMin = timeToMinutes(entry.start_time);
                  const endMin = timeToMinutes(entry.end_time);
                  const gridStart = 6 * 60;
                  const gridEnd = 23 * 60;
                  const top = ((startMin - gridStart) / (gridEnd - gridStart)) * 100;
                  const height = ((endMin - startMin) / (gridEnd - gridStart)) * 100;
                  const isOpen = activePopup === entry.id;

                  return (
                    <div key={entry.id} className={`sch-entry ${isOpen ? "sch-entry-active" : ""}`}
                      style={{ top: `${Math.max(0, top)}%`, height: `${Math.max(3, height)}%`, background: entry.color || "#6366f1" }}
                      onClick={(e) => { e.stopPropagation(); setActivePopup(isOpen ? null : entry.id); }}
                    >
                      <span className="sch-entry-title">{entry.title}</span>
                      <span className="sch-entry-time">{entry.start_time}–{entry.end_time}</span>

                      {/* action buttons on hover */}
                      <div className="sch-entry-actions">
                        <button className="sch-action-btn" title="Edit"
                          onClick={(e) => { e.stopPropagation(); setActivePopup(null); onEdit && onEdit(entry); }}>
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button className="sch-action-btn sch-action-del" title="Delete"
                          onClick={(e) => { e.stopPropagation(); handleDelete(entry.id); }}
                          disabled={deleting === entry.id}>
                          <i className={`bi ${deleting === entry.id ? "bi-hourglass" : "bi-trash-fill"}`}></i>
                        </button>
                      </div>

                      {/* detail popup */}
                      {isOpen && (
                        <div className="sch-popup" onClick={e => e.stopPropagation()}>
                          <div className="d-flex align-items-center gap-2 mb-2">
                            <span style={{ width: 10, height: 10, borderRadius: "50%", background: entry.color || "#6366f1" }}></span>
                            <strong>{entry.title}</strong>
                          </div>
                          <div className="text-muted small mb-1">
                            <i className="bi bi-clock me-1"></i>{entry.start_time} – {entry.end_time}
                          </div>
                          <div className="text-muted small mb-1">
                            <i className="bi bi-tag me-1"></i>{entry.activity_type || "—"}
                          </div>
                          {entry.notes && <div className="text-muted small mb-2"><i className="bi bi-sticky me-1"></i>{entry.notes}</div>}
                          <div className="d-flex gap-1">
                            <button className="btn btn-sm btn-outline-primary flex-fill"
                              onClick={() => { setActivePopup(null); onEdit && onEdit(entry); }}>
                              <i className="bi bi-pencil me-1"></i>Edit
                            </button>
                            <button className="btn btn-sm btn-outline-danger flex-fill"
                              onClick={() => handleDelete(entry.id)} disabled={deleting === entry.id}>
                              <i className="bi bi-trash me-1"></i>Delete
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        {/* close popup on outside click */}
        {activePopup && <div className="position-fixed top-0 start-0 w-100 h-100" style={{ zIndex: 1 }} onClick={() => setActivePopup(null)} />}
      </div>

      {/* ── Mobile / Tablet List View ── */}
      <div className="d-lg-none">
        {DAYS.map((day, dayIdx) => {
          const dayEntries = entriesByDay[dayIdx].slice().sort(
            (a, b) => (a.start_time || "").localeCompare(b.start_time || "")
          );
          return (
            <div key={day} className="sch-mobile-day">
              <h6 className={`fw-bold mb-2 ${dayIdx === todayIndex ? "text-wb-primary" : ""}`}>
                <i className="bi bi-calendar3 me-1"></i>{day}
                {dayIdx === todayIndex && <span className="badge bg-primary ms-2" style={{ fontSize: ".65rem" }}>Today</span>}
                <span className="text-muted ms-2" style={{ fontSize: ".75rem", fontWeight: 400 }}>({dayEntries.length})</span>
              </h6>
              {dayEntries.length === 0 ? (
                <p className="text-muted small ms-3 mb-2">No activities</p>
              ) : (
                dayEntries.map(entry => (
                  <div key={entry.id} className="sch-mobile-entry" style={{ borderLeftColor: entry.color || "#6366f1" }}>
                    <div style={{ width: 6, height: 6, borderRadius: "50%", background: entry.color || "#6366f1", flexShrink: 0, marginTop: 6 }} />
                    <div className="flex-fill ms-2">
                      <div className="fw-semibold small">{entry.title}</div>
                      <div className="text-muted" style={{ fontSize: ".72rem" }}>
                        {entry.start_time} – {entry.end_time}
                        {entry.activity_type && <span className="sch-mobile-type">{entry.activity_type}</span>}
                      </div>
                    </div>
                    <div className="d-flex gap-1 ms-2">
                      <button className="btn btn-sm btn-outline-primary py-0 px-1" onClick={() => onEdit && onEdit(entry)}>
                        <i className="bi bi-pencil" style={{ fontSize: ".7rem" }}></i>
                      </button>
                      <button className="btn btn-sm btn-outline-danger py-0 px-1" onClick={() => handleDelete(entry.id)} disabled={deleting === entry.id}>
                        <i className={`bi ${deleting === entry.id ? "bi-hourglass" : "bi-trash"}`} style={{ fontSize: ".7rem" }}></i>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          );
        })}
      </div>

      {(!entries || entries.length === 0) && (
        <div className="text-center py-4 text-muted">
          <i className="bi bi-calendar-plus fs-1 d-block mb-2"></i>
          <p className="mb-0">No schedule entries yet. Start by adding activities!</p>
        </div>
      )}
    </div>
  );
}
