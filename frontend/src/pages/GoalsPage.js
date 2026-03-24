import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ProgressModal from "../components/ProgressModal";
import GoalProgress from "../components/GoalProgress";
import {
  getGoals,
  addGoal,
  updateGoal,
  deleteGoal,
  addMilestone,
  updateMilestone,
  deleteMilestone
} from "../services/api";

const CATEGORIES = [
  { value: "fitness", label: "Fitness" },
  { value: "nutrition", label: "Nutrition" },
  { value: "sleep", label: "Sleep" },
  { value: "mental", label: "Mental" },
  { value: "general", label: "General" },
];

// Utility to split active/completed goals
function splitGoals(goals) {
  const active = goals.filter(g => !g.completed);
  const completed = goals.filter(g => g.completed);
  return { active, completed };
}

export default function GoalsPage() {
  const { user } = useAuth();
  const uname = user?.username || "guest";
  const [goals, setGoals] = useState([]);
  const [active, setActive] = useState([]);
  const [completed, setCompleted] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formMsg, setFormMsg] = useState({ type: "", text: "" });
  // Goal form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("fitness");
  const [target, setTarget] = useState("");
  const [unit, setUnit] = useState("");
  const [startDate, setStartDate] = useState("");
  const [deadline, setDeadline] = useState("");
  // Edit goal progress
  const [editId, setEditId] = useState(null);
  const [editValue, setEditValue] = useState("");
  // Milestone add form state (for existing goals)
  const [msGoalId, setMsGoalId] = useState(null);
  const [msTitle, setMsTitle] = useState("");
  const [msTarget, setMsTarget] = useState("");
  // Removed msDueDate (date) field
  const [msFrequency, setMsFrequency] = useState("daily");
  // Inline milestones for NEW goal creation
  const [newMilestones, setNewMilestones] = useState([]);
  const [nmTitle, setNmTitle] = useState("");
  const [nmTarget, setNmTarget] = useState("");
  // Removed nmDate (date) field
  const [nmFreq, setNmFreq] = useState("daily");
  // Popup state for milestone progress
  const [popup, setPopup] = useState({ show: false, milestone: null, goal: null });
  // Modal input value for milestone progress
  const [modalValue, setModalValue] = useState("");
  useEffect(() => { setModalValue(""); }, [popup.milestone]);

  // Load goals from backend
  const load = async () => {
    setLoading(true);
    try {
      const data = await getGoals(uname);
      setGoals(data);
      const { active, completed } = splitGoals(data);
      setActive(active);
      setCompleted(completed);
    } catch (e) {
      setFormMsg({ type: "danger", text: "Failed to load goals." });
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uname]);

  // Save milestone progress (calls backend, closes popup)
  const handleSaveMilestoneProgress = async (value) => {
    if (!popup.milestone || !popup.goal) return;
    try {
      await updateMilestone(popup.milestone.id, { target_value: parseFloat(value) });
      setPopup({ show: false, milestone: null, goal: null });
      load();
    } catch (e) { setFormMsg({ type: "danger", text: "Failed to update milestone." }); }
  };

  // Update goal progress
  const handleUpdateProgress = async (goalId) => {
    try {
      await updateGoal(goalId, { current_value: parseFloat(editValue) });
      setEditId(null);
      setEditValue("");
      load();
    } catch (e) {
      setFormMsg({ type: "danger", text: "Failed to update goal progress." });
    }
  };

  // Toggle milestone completion
  const handleToggleMilestone = async (milestoneId, completed) => {
    try {
      await updateMilestone(milestoneId, { completed });
      load();
    } catch (e) {
      setFormMsg({ type: "danger", text: "Failed to update milestone." });
    }
  };

  // Delete milestone
  const handleDeleteMilestone = async (milestoneId) => {
    try {
      await deleteMilestone(milestoneId);
      load();
    } catch (e) {
      setFormMsg({ type: "danger", text: "Failed to delete milestone." });
    }
  };

  // Add milestone to existing goal
  const handleAddMilestone = async (goalId) => {
    if (!msTitle.trim()) return;
    try {
      await addMilestone(goalId, {
        title: msTitle.trim(),
        target_value: parseFloat(msTarget) || 0,
        frequency: msFrequency,
      });
      setMsGoalId(null);
      setMsTitle("");
      setMsTarget("");
      setMsFrequency("daily");
      load();
    } catch (e) {
      setFormMsg({ type: "danger", text: "Failed to add milestone." });
    }
  };

  // Delete goal
  const handleDeleteGoal = async (goalId) => {
    try {
      await deleteGoal(goalId);
      load();
    } catch (e) {
      setFormMsg({ type: "danger", text: "Failed to delete goal." });
    }
  };

  // Add new goal
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !target || !unit) {
      setFormMsg({ type: "danger", text: "Please fill all required fields." });
      return;
    }
    try {
      await addGoal({
        user_name: uname,
        title: title.trim(),
        category,
        target_value: parseFloat(target),
        unit,
        start_date: startDate,
        deadline,
        milestones: newMilestones,
      });
      setTitle("");
      setCategory("fitness");
      setTarget("");
      setUnit("");
      setStartDate("");
      setDeadline("");
      setNewMilestones([]);
      setFormMsg({ type: "success", text: "Goal created!" });
      load();
    } catch (e) {
      setFormMsg({ type: "danger", text: "Failed to create goal." });
    }
  };




  if (loading) return <div className="container py-5 text-center"><div className="spinner-border text-primary"></div></div>;

  return (
    <div className="container py-4">
      <h2 className="wb-page-header mb-4"><i className="bi bi-trophy me-2"></i>Goals & Milestones</h2>


      {/* Active Goals — Update Progress + Milestones */}
      {active.length > 0 && (
        <div className="wb-card-static p-4 mb-4">
          <h5 className="fw-bold mb-2 wb-card-title"><i className="bi bi-arrow-up-circle me-2"></i>Manage Goals & Sub-Tasks</h5>
          <p className="text-muted small mb-3">
            <i className="bi bi-info-circle me-1"></i>
            Update your progress, check off milestones, or add new ones. Click the pencil to update the goal value.
            When it reaches the target, the goal is marked complete.
          </p>
          {active.map(g => {
            const milestones = (g.milestones || []).sort((a, b) => a.sort_order - b.sort_order);
            return (
              <div key={g.id} className="mb-4 p-3 rounded-3" style={{ background: "rgba(99,102,241,0.04)" }}>
                {/* Goal header row */}
                <div className="d-flex align-items-center gap-2 mb-2">
                  <div className="flex-fill">
                    <div className="fw-bold">{g.title}</div>
                    <div className="text-muted small">{g.current_value}/{g.target_value} {g.unit}</div>
                  </div>
                  {editId === g.id ? (
                    <div className="d-flex gap-1 align-items-center">
                      <input type="number" className="form-control form-control-sm border-primary fw-bold" style={{ width: 90, fontSize: '1rem' }}
                        value={editValue} onChange={e => setEditValue(e.target.value)} placeholder="New value" min="0" />
                      <button className="btn btn-sm btn-success fw-bold" title="Save Progress" onClick={() => handleUpdateProgress(g.id)}>
                        <i className="bi bi-check"></i>
                      </button>
                      <button className="btn btn-sm btn-outline-secondary" title="Cancel" onClick={() => setEditId(null)}>
                        <i className="bi bi-x"></i>
                      </button>
                    </div>
                  ) : (
                    <button className="btn btn-sm btn-primary fw-bold px-3" title="Update goal progress" style={{ fontSize: '1rem' }}
                      onClick={() => { setEditId(g.id); setEditValue(String(g.current_value)); }}>
                      <i className="bi bi-pencil me-1"></i>Update
                    </button>
                  )}
                  <button className="btn btn-sm btn-outline-danger" onClick={async () => { await deleteGoal(g.id); load(); }}>
                    <i className="bi bi-trash"></i>
                  </button>
                </div>

                {/* Milestone progress + checklist */}
                <GoalProgress goal={g} onToggleMilestone={handleToggleMilestone} />

                {/* Milestones list - delete buttons */}
                {milestones.length > 0 && (
                  <div className="mb-2 mt-2">
                    {milestones.map((m) => (
                      <div key={m.id} className="d-flex align-items-center gap-2 py-1 ps-2"
                        style={{ borderLeft: `2px solid ${m.completed ? "#10b981" : "#e2e8f0"}` }}>
                        <button
                          className={`btn btn-sm p-0 ${m.completed ? "text-success" : "text-muted"}`}
                          style={{ width: 24, height: 24 }}
                          onClick={() => handleToggleMilestone(m.id, !m.completed)}
                        >
                          <i className={`bi ${m.completed ? "bi-check-circle-fill" : "bi-circle"}`}></i>
                        </button>
                        <span className={`small flex-fill ${m.completed ? "text-decoration-line-through text-muted" : "fw-semibold"}`}>
                          {m.title}
                        </span>
                        {/* Popup update button for daily/weekly milestones */}
                        {(["daily", "weekly"].includes(m.frequency)) && !m.completed && (
                          <button className="btn btn-sm btn-outline-info px-2 py-0" style={{ fontSize: "0.8rem" }}
                            onClick={() => setPopup({ show: true, milestone: m, goal: g })}>
                            <i className="bi bi-pencil-square me-1"></i>Update
                          </button>
                        )}
                        {m.due_date && (
                          <span className="text-muted" style={{ fontSize: "0.68rem" }}>
                            <i className="bi bi-calendar-event me-1"></i>
                            {new Date(m.due_date + "T00:00:00").toLocaleDateString("en", { month: "short", day: "numeric" })}
                          </span>
                        )}
                        {m.target_value > 0 && (
                          <span className="text-muted" style={{ fontSize: "0.72rem" }}>{m.target_value} {g.unit}</span>
                        )}
                        <button className="btn btn-sm p-0 text-danger" onClick={() => handleDeleteMilestone(m.id)}
                          style={{ width: 20, height: 20, fontSize: "0.7rem" }}>
                          <i className="bi bi-x-lg"></i>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
      {/* Progress update popup/modal */}
      <ProgressModal
        show={popup.show}
        onClose={() => setPopup({ show: false, milestone: null, goal: null })}
        onSave={handleSaveMilestoneProgress}
        milestone={popup.milestone}
        goal={popup.goal}
        value={modalValue}
        setValue={setModalValue}
      />

                {/* Add milestone form */}
                {msGoalId === g.id ? (
                  <div className="ms-add-row mt-2">
                    <input type="text" className="form-control" value={msTitle}
                      onChange={e => setMsTitle(e.target.value)} placeholder="Milestone name" />
                    <input type="number" className="form-control" style={{ width: 80 }}
                      value={msTarget} onChange={e => setMsTarget(e.target.value)}
                      placeholder={g.unit || "Value"} min="0" step="0.1" />
                    {/* Removed date input for milestone */}
                    <select className="form-select" style={{ width: 110 }}
                      value={msFrequency} onChange={e => setMsFrequency(e.target.value)}>
                      <option value="daily">Daily</option>
                      <option value="weekly">Weekly</option>
                    </select>
                    <button className="btn btn-sm btn-success" onClick={() => handleAddMilestone(g.id)}>
                      <i className="bi bi-plus-lg"></i>
                    </button>
                    <button className="btn btn-sm btn-outline-secondary"
                      onClick={() => { setMsGoalId(null); setMsTitle(""); setMsTarget(""); setMsFrequency("daily"); }}>
                      <i className="bi bi-x"></i>
                    </button>
                  </div>
                ) : (
                  <button className="btn btn-sm btn-outline-primary mt-1"
                    onClick={() => { setMsGoalId(g.id); setMsTitle(""); setMsTarget(""); setMsFrequency("daily"); }}>
                    <i className="bi bi-plus-circle me-1"></i>Add Milestone
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* New Goal Form */}
      <div className="wb-card-static p-4 mb-4">
        <h5 className="fw-bold mb-2 wb-card-title"><i className="bi bi-plus-circle me-2"></i>Create New Goal</h5>
        <p className="text-muted small mb-3">
          <i className="bi bi-info-circle me-1"></i>
          Set a measurable goal with a target value. Add milestones (sub-tasks) to break it into smaller steps.
          Choose <strong>Daily</strong>, <strong>Weekly</strong>, or <strong>Monthly</strong> frequency for recurring milestones,
          or <strong>Once</strong> for one-time tasks.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="row g-3">
            <div className="col-md-3">
              <label className="form-label">Goal Title</label>
              <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} placeholder='e.g. "Run 50km this month"' />
            </div>
            <div className="col-md-2">
              <label className="form-label">Category</label>
              <select className="form-select" value={category} onChange={e => setCategory(e.target.value)}>
                {CATEGORIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Target</label>
              <input type="number" className="form-control" value={target} onChange={e => setTarget(e.target.value)} min="0" step="0.1" placeholder="50" />
            </div>
            <div className="col-md-1">
              <label className="form-label">Unit</label>
              <input type="text" className="form-control" value={unit} onChange={e => setUnit(e.target.value)} placeholder="km" />
            </div>
            <div className="col-md-2">
              <label className="form-label">Start</label>
              <input type="date" className="form-control" value={startDate} onChange={e => setStartDate(e.target.value)} />
            </div>
            <div className="col-md-2">
              <label className="form-label">Deadline</label>
              <input type="date" className="form-control" value={deadline} onChange={e => setDeadline(e.target.value)} />
            </div>
          </div>

          {/* ── Inline Milestones Builder ── */}
          <div className="mt-3 p-3 rounded-3" style={{ background: "rgba(99,102,241,0.04)", border: "1px dashed rgba(99,102,241,0.2)" }}>
            <div className="d-flex align-items-center gap-2 mb-2">
              <i className="bi bi-flag text-primary"></i>
              <span className="fw-semibold small">Milestones (optional)</span>
              <span className="text-muted" style={{ fontSize: "0.7rem" }}>— break your goal into checkpoints</span>
            </div>

            {/* List of added milestones */}
            {newMilestones.length > 0 && (
              <div className="mb-2">
                {newMilestones.map((m, i) => (
                  <div key={i} className="d-flex align-items-center gap-2 py-1 ps-2"
                    style={{ borderLeft: "2px solid #6366f1" }}>
                    <i className="bi bi-circle text-muted" style={{ fontSize: "0.7rem" }}></i>
                    <span className="small fw-semibold flex-fill">{m.title}</span>
                    {m.target_value > 0 && <span className="text-muted" style={{ fontSize: "0.7rem" }}>{m.target_value} {unit}</span>}
                    {m.due_date && <span className="text-muted" style={{ fontSize: "0.7rem" }}><i className="bi bi-calendar3 me-1"></i>{m.due_date}</span>}
                    {m.frequency !== "once" && <span className="badge bg-info bg-opacity-10 text-info" style={{ fontSize: "0.65rem" }}>{m.frequency}</span>}
                    <button type="button" className="btn btn-sm p-0 text-danger" onClick={() => setNewMilestones(prev => prev.filter((_, j) => j !== i))}>
                      <i className="bi bi-x-lg" style={{ fontSize: "0.65rem" }}></i>
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* Add milestone row */}
            <div className="d-flex gap-2 align-items-end flex-wrap">
              <input type="text" className="form-control form-control-sm" style={{ maxWidth: 200 }}
                value={nmTitle} onChange={e => setNmTitle(e.target.value)} placeholder="Milestone name"
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    if (!nmTitle.trim()) return;
                    setNewMilestones(prev => [...prev, {
                      title: nmTitle.trim(), target_value: parseFloat(nmTarget) || 0,
                      frequency: nmFreq,
                    }]);
                    setNmTitle(""); setNmTarget(""); setNmFreq("daily");
                  }
                }} />
              <input type="number" className="form-control form-control-sm" style={{ width: 80 }}
                value={nmTarget} onChange={e => setNmTarget(e.target.value)} placeholder={unit || "Value"} min="0" step="0.1"
                onKeyDown={e => { if (e.key === "Enter") e.preventDefault(); }} />
              {/* Removed date input for new milestone */}
              <select className="form-select form-select-sm" style={{ width: 110 }}
                value={nmFreq} onChange={e => setNmFreq(e.target.value)}>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
              <button type="button" className="btn btn-sm btn-outline-success"
                onClick={() => {
                  if (!nmTitle.trim()) return;
                  const perMilestone = parseFloat(nmTarget) || 0;
                  if ((nmFreq === "daily" || nmFreq === "weekly") && perMilestone > 0 && startDate && deadline) {
                    // Auto-generate milestones using date range
                    const start = new Date(startDate);
                    const end = new Date(deadline);
                    let ms = [];
                    let count = 0;
                    let curr = new Date(start);
                    while (curr <= end) {
                      ms.push({
                        title: `${nmTitle.trim()} ${nmFreq === "weekly" ? "Week" : "Day"} ${count + 1}`,
                        target_value: perMilestone,
                        frequency: nmFreq,
                      });
                      count++;
                      if (nmFreq === "weekly") {
                        curr.setDate(curr.getDate() + 7);
                      } else {
                        curr.setDate(curr.getDate() + 1);
                      }
                    }
                    setNewMilestones(prev => [...prev, ...ms]);
                  } else {
                    setNewMilestones(prev => [...prev, {
                      title: nmTitle.trim(), target_value: perMilestone, frequency: nmFreq,
                    }]);
                  }
                  setNmTitle(""); setNmTarget(""); setNmFreq("daily");
                }}>
                <i className="bi bi-plus-lg me-1"></i>Add
              </button>
            </div>
          </div>

          <button className="btn btn-wb-primary mt-3" type="submit"><i className="bi bi-plus-lg me-1"></i>Create Goal</button>
        </form>
        {formMsg.text && <div className={`alert alert-${formMsg.type} py-2 small mt-3 mb-0`}>{formMsg.text}</div>}
      </div>

      {/* Completed Goals */}
      {completed.length > 0 && (
        <div className="wb-card-static p-4">
          <h5 className="fw-bold mb-3 wb-card-title"><i className="bi bi-check-circle me-2"></i>Completed Goals ({completed.length})</h5>
          <div className="row g-2">
            {completed.map(g => (
              <div className="col-md-4" key={g.id}>
                <div className="p-2 rounded-3 d-flex align-items-center gap-2" style={{ background: "rgba(16,185,129,0.08)" }}>
                  <i className="bi bi-trophy-fill text-success"></i>
                  <span className="fw-bold small flex-fill">{g.title}</span>
                  <span className="text-muted small">{g.target_value} {g.unit}</span>
                  <button className="btn btn-sm p-0 text-danger" onClick={async () => { await deleteGoal(g.id); load(); }}
                    title="Delete goal" style={{ width: 20, height: 20, fontSize: "0.7rem" }}>
                    <i className="bi bi-x-lg"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
