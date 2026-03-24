import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getHealthRecords, addHealthRecord, updateHealthRecord, deleteHealthRecord } from "../services/api";
import DataTable from "../components/DataTable";

const RECORD_TYPES = [
  { value: "appointment", label: "Appointment", icon: "bi-calendar-event", color: "#6366f1" },
  { value: "vaccine", label: "Vaccine", icon: "bi-shield-plus", color: "#10b981" },
  { value: "medication", label: "Medication", icon: "bi-capsule", color: "#f59e0b" },
];
const STATUS_OPTIONS = ["upcoming", "completed", "missed", "ongoing"];

export default function HealthRecordsPage() {
  const { user } = useAuth();
  const uname = user?.username || "guest";
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("appointment");
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [notes, setNotes] = useState("");
  const [status, setStatus] = useState("upcoming");
  const [provider, setProvider] = useState("");
  const [recurring, setRecurring] = useState(false);

  const load = async () => {
    try { setRecords(await getHealthRecords(uname)); } catch (e) { console.error(e); }
    setLoading(false);
  };
  useEffect(() => { load(); }, [uname, load]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormMsg({ type: "", text: "" });
    if (!title.trim() || !date) { setFormMsg({ type: "danger", text: "Title and date are required." }); return; }
    try {
      await addHealthRecord({ user_name: uname, record_type: tab, title: title.trim(), record_date: date, notes: notes.trim(), status, provider: provider.trim(), recurring });
      setFormMsg({ type: "success", text: "Record added!" });
      setTitle(""); setDate(""); setNotes(""); setStatus("upcoming"); setProvider(""); setRecurring(false);
      load();
    } catch (e) { setFormMsg({ type: "danger", text: "Failed to add record." }); }
  };

  const toggleStatus = async (rec) => {
    const next = rec.status === "completed" ? "upcoming" : "completed";
    await updateHealthRecord(rec.id, { ...rec, status: next });
    load();
  };

  const filteredByType = (type) => records.filter(r => r.record_type === type);
  const upcoming = records.filter(r => r.status === "upcoming" && new Date(r.record_date) >= new Date(new Date().toDateString()));

  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <h2 className="wb-page-header mb-4"><i className="bi bi-clipboard2-pulse me-2"></i>Health Records</h2>

      {/* KPI */}
      <div className="row g-3 mb-4">
        {[
          { label: "Total Records", value: records.length, icon: "bi-folder2-open", color: "primary" },
          { label: "Appointments", value: filteredByType("appointment").length, icon: "bi-calendar-event", color: "info" },
          { label: "Vaccines", value: filteredByType("vaccine").length, icon: "bi-shield-plus", color: "success" },
          { label: "Medications", value: filteredByType("medication").length, icon: "bi-capsule", color: "warning" },
          { label: "Upcoming", value: upcoming.length, icon: "bi-clock", color: "danger" },
        ].map((k, i) => (
          <div className="col-6 col-md" key={i}>
            <div className="wb-card-static p-3 text-center h-100">
              <i className={`bi ${k.icon} text-${k.color}`} style={{ fontSize: "1.4rem" }}></i>
              <div className="fw-bold fs-4 mt-1">{k.value}</div>
              <div className="text-muted small">{k.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Upcoming Reminders */}
      {upcoming.length > 0 && (
        <div className="wb-card-static p-4 mb-4" style={{ borderLeft: "4px solid #6366f1" }}>
          <h5 className="fw-bold mb-3"><i className="bi bi-bell me-2 text-primary"></i>Upcoming Reminders</h5>
          <div className="row g-2">
            {upcoming.slice(0, 6).map(r => {
              const t = RECORD_TYPES.find(rt => rt.value === r.record_type);
              return (
                <div className="col-md-4" key={r.id}>
                  <div className="d-flex align-items-center gap-2 p-2 rounded-3" style={{ background: `${t?.color}10` }}>
                    <i className={`bi ${t?.icon}`} style={{ color: t?.color, fontSize: "1.2rem" }}></i>
                    <div className="flex-fill">
                      <div className="fw-bold small">{r.title}</div>
                      <div className="text-muted" style={{ fontSize: "0.75rem" }}>
                        {new Date(r.record_date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        {r.provider && ` · ${r.provider}`}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tabs */}
      <ul className="nav nav-pills mb-4 gap-2">
        {RECORD_TYPES.map(rt => (
          <li className="nav-item" key={rt.value}>
            <button className={`nav-link ${tab === rt.value ? "active" : ""}`} onClick={() => setTab(rt.value)}>
              <i className={`bi ${rt.icon} me-1`}></i>{rt.label}s
              <span className="badge bg-white bg-opacity-25 ms-2">{filteredByType(rt.value).length}</span>
            </button>
          </li>
        ))}
      </ul>

      <div className="row g-4">
        {/* Form */}
        <div className="col-lg-5">
          <div className="wb-card-static p-4">
            <h5 className="fw-bold mb-3 wb-card-title">
              <i className={`bi ${RECORD_TYPES.find(r => r.value === tab)?.icon} me-2`}></i>
              Add {RECORD_TYPES.find(r => r.value === tab)?.label}
            </h5>
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)}
                  placeholder={tab === "appointment" ? "Dr. Smith Checkup" : tab === "vaccine" ? "COVID Booster" : "Vitamin D"} />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label">Date</label>
                  <input type="date" className="form-control" value={date} onChange={e => setDate(e.target.value)} />
                </div>
                <div className="col-6">
                  <label className="form-label">Status</label>
                  <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                    {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                  </select>
                </div>
              </div>
              <div className="mb-3">
                <label className="form-label">Provider / Source</label>
                <input type="text" className="form-control" value={provider} onChange={e => setProvider(e.target.value)} placeholder="Hospital, Pharmacy..." />
              </div>
              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea className="form-control" rows="2" value={notes} onChange={e => setNotes(e.target.value)} placeholder="Additional details..." />
              </div>
              <div className="form-check mb-3">
                <input type="checkbox" className="form-check-input" id="recurring" checked={recurring} onChange={e => setRecurring(e.target.checked)} />
                <label className="form-check-label" htmlFor="recurring">Recurring</label>
              </div>
              <button type="submit" className="btn btn-wb-primary w-100"><i className="bi bi-plus-lg me-1"></i>Add Record</button>
            </form>
            {formMsg.text && <div className={`alert alert-${formMsg.type} py-2 small mt-3 mb-0`}>{formMsg.text}</div>}
          </div>
        </div>

        {/* Records Table */}
        <div className="col-lg-7">
          <DataTable
            columns={[
              { key: "title", label: "Title" },
              { key: "record_date", label: "Date", render: v => new Date(v).toLocaleDateString() },
              { key: "status", label: "Status", render: (v, row) => (
                <button className={`btn btn-sm btn-${v === "completed" ? "success" : v === "upcoming" ? "primary" : v === "missed" ? "danger" : "warning"}`}
                  onClick={() => toggleStatus(row)} style={{ minWidth: 85 }}>
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              )},
              { key: "provider", label: "Provider" },
              { key: "id", label: "", render: (v, row) => (
                <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deleteHealthRecord(row.id); load(); }}>
                  <i className="bi bi-trash"></i>
                </button>
              )},
            ]}
            data={filteredByType(tab)}
            emptyMessage={`No ${tab} records yet.`}
          />
        </div>
      </div>
    </div>
  );
}
