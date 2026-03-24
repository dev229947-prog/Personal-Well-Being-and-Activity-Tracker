import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getJournalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry } from "../services/api";

const MOOD_TAGS = [
  { value: "happy", emoji: "😊", label: "Happy" },
  { value: "calm", emoji: "😌", label: "Calm" },
  { value: "grateful", emoji: "🙏", label: "Grateful" },
  { value: "motivated", emoji: "💪", label: "Motivated" },
  { value: "anxious", emoji: "😰", label: "Anxious" },
  { value: "sad", emoji: "😢", label: "Sad" },
  { value: "frustrated", emoji: "😤", label: "Frustrated" },
  { value: "neutral", emoji: "😐", label: "Neutral" },
];

export default function JournalPage() {
  const { user } = useAuth();
  const uname = user?.username || "guest";
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const [content, setContent] = useState("");
  const [moodTag, setMoodTag] = useState("neutral");
  const [tags, setTags] = useState("");
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const load = async () => {
    try { setEntries(await getJournalEntries(uname)); } catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, [uname, load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;
    const payload = { user_name: uname, date: new Date().toISOString().split("T")[0], content: content.trim(), mood_tag: moodTag, tags: tags.trim() };
    try {
      if (editId) { await updateJournalEntry(editId, payload); setEditId(null); }
      else { await addJournalEntry(payload); }
      setContent(""); setMoodTag("neutral"); setTags("");
      load();
    } catch (e) { console.error(e); }
  };

  const startEdit = (entry) => {
    setEditId(entry.id);
    setContent(entry.content);
    setMoodTag(entry.mood_tag || "neutral");
    setTags(entry.tags || "");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const filtered = entries.filter(e => {
    if (!searchTerm) return true;
    const s = searchTerm.toLowerCase();
    return (e.content || "").toLowerCase().includes(s) || (e.tags || "").toLowerCase().includes(s) || (e.mood_tag || "").includes(s);
  });

  const moodCounts = entries.reduce((acc, e) => { acc[e.mood_tag] = (acc[e.mood_tag] || 0) + 1; return acc; }, {});
  const topMood = Object.entries(moodCounts).sort((a, b) => b[1] - a[1])[0];

  // Streak calc
  const sortedDates = [...new Set(entries.map(e => e.date || e.createdAt?.slice(0, 10)).filter(Boolean))].sort().reverse();
  let streak = 0;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  for (let i = 0; i < sortedDates.length; i++) {
    const d = new Date(sortedDates[i]); d.setHours(0, 0, 0, 0);
    const diff = Math.round((today - d) / 86400000);
    if (diff === i) streak++; else break;
  }

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <h2 className="wb-page-header mb-4"><i className="bi bi-journal-richtext me-2"></i>Journal & Reflections</h2>

      {/* KPI */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Entries", value: entries.length, icon: "bi-journal-text", color: "primary" },
          { label: "Journal Streak", value: `${streak} days`, icon: "bi-fire", color: "danger" },
          { label: "Top Mood", value: topMood ? `${MOOD_TAGS.find(m => m.value === topMood[0])?.emoji || ""} ${topMood[0]}` : "N/A", icon: "bi-emoji-smile", color: "success" },
          { label: "This Month", value: entries.filter(e => new Date(e.date || e.createdAt).getMonth() === new Date().getMonth()).length, icon: "bi-calendar-month", color: "info" },
        ].map((k, i) => (
          <div className="col-6 col-md-3" key={i}>
            <div className="wb-card-static p-3 text-center h-100">
              <i className={`bi ${k.icon} text-${k.color}`} style={{ fontSize: "1.5rem" }}></i>
              <div className="fw-bold fs-4 mt-1">{k.value}</div>
              <div className="text-muted small">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Mood Palette */}
      <div className="wb-card-static p-3 mb-4">
        <div className="d-flex flex-wrap gap-2 justify-content-center">
          {MOOD_TAGS.map(m => (
            <div key={m.value} className="text-center px-2">
              <div style={{ fontSize: "1.3rem" }}>{m.emoji}</div>
              <div className="small fw-bold">{moodCounts[m.value] || 0}</div>
              <div className="text-muted" style={{ fontSize: "0.7rem" }}>{m.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="row g-4">
        {/* Write Entry */}
        <div className="col-lg-5">
          <div className="wb-card-static p-4 sticky-top" style={{ top: 80 }}>
            <h5 className="fw-bold mb-3 wb-card-title">
              <i className={`bi ${editId ? "bi-pencil" : "bi-pen"} me-2`}></i>{editId ? "Edit Entry" : "New Entry"}
            </h5>
            <form onSubmit={handleSubmit}>
              <textarea className="form-control mb-3" rows="8" placeholder="Write your thoughts, reflections, gratitude..."
                value={content} onChange={e => setContent(e.target.value)} style={{ resize: "vertical" }} />
              <label className="form-label small fw-bold">How are you feeling?</label>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {MOOD_TAGS.map(m => (
                  <button key={m.value} type="button"
                    className={`btn btn-sm ${moodTag === m.value ? "btn-primary" : "btn-outline-secondary"}`}
                    onClick={() => setMoodTag(m.value)} title={m.label}>
                    {m.emoji} {m.label}
                  </button>
                ))}
              </div>
              <input type="text" className="form-control mb-3" placeholder="Tags (comma-separated)"
                value={tags} onChange={e => setTags(e.target.value)} />
              <div className="d-flex gap-2">
                <button className="btn btn-wb-primary flex-fill" type="submit">
                  <i className={`bi ${editId ? "bi-check-lg" : "bi-journal-plus"} me-1`}></i>
                  {editId ? "Update" : "Save Entry"}
                </button>
                {editId && (
                  <button type="button" className="btn btn-outline-secondary" onClick={() => { setEditId(null); setContent(""); setMoodTag("neutral"); setTags(""); }}>
                    Cancel
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>

        {/* Entries List */}
        <div className="col-lg-7">
          <div className="d-flex align-items-center gap-2 mb-3">
            <input type="text" className="form-control" placeholder="Search entries..."
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
            <span className="badge bg-primary">{filtered.length}</span>
          </div>
          {filtered.length === 0 ? (
            <div className="wb-card-static p-5 text-center text-muted">
              <i className="bi bi-journal-x" style={{ fontSize: "2.5rem" }}></i>
              <p className="mt-2">No journal entries yet. Start writing!</p>
            </div>
          ) : (
            filtered.map(entry => {
              const mood = MOOD_TAGS.find(m => m.value === entry.mood_tag);
              return (
                <div key={entry.id} className="wb-card-static p-3 mb-3">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <span className="badge bg-light text-dark me-2">
                        {new Date(entry.date || entry.createdAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
                      </span>
                      {entry.createdAt && <span className="badge bg-light text-dark">
                        {new Date(entry.createdAt).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
                      </span>}
                    </div>
                    {mood && <span title={mood.label} style={{ fontSize: "1.3rem" }}>{mood.emoji}</span>}
                  </div>
                  <p className="mb-2" style={{ whiteSpace: "pre-wrap" }}>{entry.content}</p>
                  {entry.tags && (
                    <div className="d-flex flex-wrap gap-1 mb-2">
                      {entry.tags.split(",").map((t, i) => (
                        <span key={i} className="badge bg-primary bg-opacity-10 text-primary">{t.trim()}</span>
                      ))}
                    </div>
                  )}
                  <div className="d-flex gap-2">
                    <button className="btn btn-sm btn-outline-primary" onClick={() => startEdit(entry)}>
                      <i className="bi bi-pencil me-1"></i>Edit
                    </button>
                    <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deleteJournalEntry(entry.id); load(); }}>
                      <i className="bi bi-trash me-1"></i>Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
