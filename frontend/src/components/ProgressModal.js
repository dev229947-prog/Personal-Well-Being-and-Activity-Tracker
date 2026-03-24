import React from "react";

export default function ProgressModal({ show, onClose, onSave, milestone, goal, value, setValue }) {
  if (!show || !milestone) return null;
  return (
    <div className="modal fade show" style={{ display: "block", background: "rgba(0,0,0,0.25)" }} tabIndex="-1">
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Update Progress</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="mb-2 fw-bold">{goal?.title} — <span className="text-primary">{milestone.title}</span></div>
            <input type="number" className="form-control" placeholder="Enter progress value" value={value} min="0"
              onChange={e => setValue(e.target.value)} autoFocus />
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button className="btn btn-success" onClick={() => onSave(value)} disabled={!value || isNaN(value)}>Save</button>
          </div>
        </div>
      </div>
    </div>
  );
}
