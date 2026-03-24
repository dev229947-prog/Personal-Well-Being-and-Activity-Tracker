import React, { useState, useEffect, useRef, useCallback } from "react";

export default function ActivityTimer() {
  const [selectedActivity, setSelectedActivity] = useState("");
  const [customActivity, setCustomActivity] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [targetMinutes, setTargetMinutes] = useState(25);
  const intervalRef = useRef(null);

  const PRESET_ACTIVITIES = [
    { value: "study", label: "Study", icon: "bi-book" },
    { value: "gym", label: "Gym / Workout", icon: "bi-heart-pulse" },
    { value: "work", label: "Work", icon: "bi-briefcase" },
    { value: "reading", label: "Reading", icon: "bi-journal-text" },
    { value: "meditation", label: "Meditation", icon: "bi-peace" },
    { value: "break", label: "Break", icon: "bi-cup-hot" },
    { value: "custom", label: "Custom...", icon: "bi-pencil" },
  ];

  const startTimer = useCallback(() => {
    if (!selectedActivity) return;
    setIsRunning(true);
  }, [selectedActivity]);

  const pauseTimer = () => setIsRunning(false);

  const resetTimer = () => {
    setIsRunning(false);
    setSeconds(0);
  };

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(() => {
        setSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  }, [isRunning]);

  const formatTime = (totalSeconds) => {
    const hrs = Math.floor(totalSeconds / 3600);
    const mins = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hrs > 0) {
      return `${hrs.toString().padStart(2, "0")}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const targetSeconds = targetMinutes * 60;
  const progress = targetSeconds > 0 ? Math.min((seconds / targetSeconds) * 100, 100) : 0;
  const isComplete = seconds >= targetSeconds && targetSeconds > 0;
  const activityLabel = selectedActivity === "custom" ? customActivity : PRESET_ACTIVITIES.find((a) => a.value === selectedActivity)?.label || "";

  return (
    <div className="wb-card-static p-4">
      <h5 className="fw-bold mb-3 wb-card-title">
        <i className="bi bi-stopwatch me-2"></i>Activity Timer
      </h5>

      {/* Activity Selection */}
      <div className="mb-3">
        <label className="form-label">
          <i className="bi bi-lightning me-1"></i>Select Activity
        </label>
        <div className="d-flex flex-wrap gap-2">
          {PRESET_ACTIVITIES.map((act) => (
            <button
              key={act.value}
              className={`btn btn-sm ${selectedActivity === act.value ? "btn-wb-primary" : "btn-outline-secondary"}`}
              onClick={() => {
                setSelectedActivity(act.value);
                if (!isRunning) setSeconds(0);
              }}
            >
              <i className={`bi ${act.icon} me-1`}></i>{act.label}
            </button>
          ))}
        </div>
      </div>

      {selectedActivity === "custom" && (
        <div className="mb-3">
          <input
            type="text"
            className="form-control"
            placeholder="Enter activity name..."
            value={customActivity}
            onChange={(e) => setCustomActivity(e.target.value)}
          />
        </div>
      )}

      {/* Target Duration */}
      <div className="mb-3">
        <label className="form-label">
          <i className="bi bi-clock me-1"></i>Target Duration (minutes)
        </label>
        <div className="d-flex gap-2">
          {[15, 25, 30, 45, 60, 90].map((mins) => (
            <button
              key={mins}
              className={`btn btn-sm ${targetMinutes === mins ? "btn-wb-accent" : "btn-outline-secondary"}`}
              onClick={() => setTargetMinutes(mins)}
            >
              {mins}m
            </button>
          ))}
        </div>
      </div>

      {/* Timer Display */}
      <div className="text-center py-4">
        {activityLabel && (
          <div className="text-muted small mb-2">
            <i className="bi bi-activity me-1"></i>{activityLabel}
          </div>
        )}
        <div className={`display-2 fw-bold font-monospace ${isComplete ? "text-wb-success" : "text-wb-primary"}`}>
          {formatTime(seconds)}
        </div>
        <div className="text-muted small mt-1">
          Target: {targetMinutes} min
        </div>

        {/* Progress Bar */}
        <div className="progress mt-3" style={{ height: "8px", borderRadius: "4px" }}>
          <div
            className={`progress-bar ${isComplete ? "bg-success" : ""}`}
            style={{
              width: `${progress}%`,
              background: isComplete ? undefined : "var(--wb-gradient)",
              transition: "width 1s linear",
            }}
          ></div>
        </div>

        {isComplete && (
          <div className="alert alert-success py-2 small mt-3 mb-0">
            <i className="bi bi-trophy-fill me-1"></i>Target reached! Great job!
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="d-flex gap-2 justify-content-center">
        {!isRunning ? (
          <button
            className="btn btn-wb-primary btn-lg px-4"
            onClick={startTimer}
            disabled={!selectedActivity || (selectedActivity === "custom" && !customActivity)}
          >
            <i className={`bi ${seconds > 0 ? "bi-play-fill" : "bi-play-fill"} me-2`}></i>
            {seconds > 0 ? "Resume" : "Start"}
          </button>
        ) : (
          <button className="btn btn-warning btn-lg px-4" onClick={pauseTimer}>
            <i className="bi bi-pause-fill me-2"></i>Pause
          </button>
        )}
        <button className="btn btn-outline-danger btn-lg px-4" onClick={resetTimer} disabled={seconds === 0}>
          <i className="bi bi-arrow-counterclockwise me-2"></i>Reset
        </button>
      </div>
    </div>
  );
}
