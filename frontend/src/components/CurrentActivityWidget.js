import React, { useState, useEffect, useCallback, useRef } from "react";
import { getSchedule, recordTaskCompletion } from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function CurrentActivityWidget() {
  const { isAuthenticated, user } = useAuth();
  const [activity, setActivity] = useState(null);
  const [nextActivity, setNextActivity] = useState(null);
  const [timeLeft, setTimeLeft] = useState("");
  const [dismissed, setDismissed] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hasSchedule, setHasSchedule] = useState(false);

  // Completion popup state
  const [completionPrompt, setCompletionPrompt] = useState(null); // { id, title, color }
  const [completionResult, setCompletionResult] = useState(null); // { done: bool, title }
  const promptedRef = useRef(new Set()); // track which entry IDs we already prompted for today

  const nowMinutes = () => {
    const n = new Date();
    return n.getHours() * 60 + n.getMinutes();
  };

  const toMinutes = (t) => {
    const [h, m] = t.split(":").map(Number);
    return h * 60 + m;
  };

  const fmtDuration = (mins) => {
    if (mins <= 0) return "0m";
    const h = Math.floor(mins / 60);
    const m = mins % 60;
    return h > 0 ? `${h}h ${m}m` : `${m}m`;
  };

  const todayISO = () => new Date().toISOString().slice(0, 10);

  // Track last seen activity id to detect removal
  const lastActivityIdRef = useRef(null);

  const findCurrent = useCallback(async () => {
    if (!isAuthenticated || !user?.username) return;
    try {
      const res = await getSchedule(user.username);
      const all = Array.isArray(res) ? res : [];
      const todayIdx = (new Date().getDay() + 6) % 7;
      const entries = all.filter(e => e.day_of_week === todayIdx);
      setHasSchedule(entries.length > 0);
      const now = nowMinutes();

      const current = entries.find(e =>
        toMinutes(e.start_time) <= now && toMinutes(e.end_time) > now
      );

      const upcoming = entries
        .filter(e => toMinutes(e.start_time) > now)
        .sort((a, b) => toMinutes(a.start_time) - toMinutes(b.start_time))[0];

      // Check if an activity just ended (end_time passed, not the current one)
      const justEnded = entries.find(e => {
        const endMin = toMinutes(e.end_time);
        return endMin <= now && endMin > now - 2 && !promptedRef.current.has(e.id);
      });

      if (justEnded && !completionPrompt) {
        promptedRef.current.add(justEnded.id);
        setCompletionPrompt({
          id: justEnded.id,
          title: justEnded.title,
          color: justEnded.color || "#6366f1",
        });
      }

      // If the previously tracked activity is gone, and it was active, record as not completed
      if (lastActivityIdRef.current && !entries.some(e => e.id === lastActivityIdRef.current) && activity && activity.id === lastActivityIdRef.current && user?.username) {
        try {
          await recordTaskCompletion({
            user_name: user.username,
            schedule_entry_id: lastActivityIdRef.current,
            date: todayISO(),
            completed: false,
            title: activity.title,
            deleted: true
          });
        } catch {}
      }
      setActivity(current || null);
      setNextActivity(upcoming || null);
      lastActivityIdRef.current = current ? current.id : null;
    } catch {
      /* silent */
    }
  }, [isAuthenticated, user, completionPrompt]);

  // Fetch every 30s (more responsive for detecting ended tasks)
  useEffect(() => {
    findCurrent();
    const iv = setInterval(findCurrent, 30000);
    return () => clearInterval(iv);
  }, [findCurrent]);

  // Countdown timer — detect when activity ends and trigger prompt
  useEffect(() => {
    if (!activity) { setTimeLeft(""); return; }
    const tick = () => {
      const n = new Date();
      const nowS = n.getHours() * 3600 + n.getMinutes() * 60 + n.getSeconds();
      const [eh, em] = activity.end_time.split(":").map(Number);
      const endS = eh * 3600 + em * 60;
      const diff = endS - nowS;
      if (diff <= 0) {
        setTimeLeft("ending...");
        // Timer just hit zero — show completion prompt
        if (!promptedRef.current.has(activity.id) && !completionPrompt) {
          promptedRef.current.add(activity.id);
          setCompletionPrompt({
            id: activity.id,
            title: activity.title,
            color: activity.color || "#6366f1",
          });
        }
        return;
      }
      const h = Math.floor(diff / 3600);
      const m = Math.floor((diff % 3600) / 60);
      const s = diff % 60;
      setTimeLeft(h > 0 ? `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}` : `${m}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const iv = setInterval(tick, 1000);
    return () => clearInterval(iv);
  }, [activity, completionPrompt]);

  // Handle completion response
  const handleCompletion = async (done) => {
    if (!completionPrompt || !user?.username) return;
    try {
      await recordTaskCompletion({
        user_name: user.username,
        schedule_entry_id: completionPrompt.id,
        date: todayISO(),
        completed: done,
        title: completionPrompt.title,
      });
    } catch {
      /* silent — still dismiss the popup */
    }
    setCompletionResult({ done, title: completionPrompt.title });
    setCompletionPrompt(null);
    // Auto-dismiss result feedback after 3s
    setTimeout(() => setCompletionResult(null), 3000);
    // Re-fetch to pick up next activity
    findCurrent();
  };

  if (!isAuthenticated || !hasSchedule || dismissed) return null;

  const progress = activity
    ? (() => {
        const now = nowMinutes();
        const start = toMinutes(activity.start_time);
        const end = toMinutes(activity.end_time);
        return Math.min(100, Math.max(0, ((now - start) / (end - start)) * 100));
      })()
    : 0;

  const color = activity?.color || nextActivity?.color || "#6366f1";

  return (
    <>
      {/* ── Completion Popup Overlay ── */}
      {completionPrompt && (
        <div className="caw-overlay">
          <div className="caw-completion-popup">
            <div className="caw-completion-icon" style={{ color: completionPrompt.color }}>
              <i className="bi bi-bell-fill"></i>
            </div>
            <div className="caw-completion-heading">Time's Up!</div>
            <div className="caw-completion-task">{completionPrompt.title}</div>
            <div className="caw-completion-question">Did you complete this task?</div>
            <div className="caw-completion-buttons">
              <button className="caw-btn-yes" onClick={() => handleCompletion(true)}>
                <i className="bi bi-check-circle-fill"></i> Yes, Done!
              </button>
              <button className="caw-btn-no" onClick={() => handleCompletion(false)}>
                <i className="bi bi-x-circle-fill"></i> Not Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Result Toast ── */}
      {completionResult && (
        <div className={`caw-result-toast ${completionResult.done ? "caw-result-done" : "caw-result-skip"}`}>
          <i className={`bi ${completionResult.done ? "bi-check-circle-fill" : "bi-x-circle-fill"}`}></i>
          {completionResult.done
            ? ` "${completionResult.title}" marked complete!`
            : ` "${completionResult.title}" marked as not done`
          }
        </div>
      )}

      <div className={`caw-widget ${expanded ? "caw-expanded" : ""}`}>
        {/* Close button */}
        <button className="caw-close" onClick={() => setDismissed(true)} title="Dismiss">
          <i className="bi bi-x"></i>
        </button>

        {/* Collapsed: just the pulsating circle */}
        <div className="caw-circle" onClick={() => setExpanded(!expanded)}
          style={{ "--caw-color": color }}>
          <svg className="caw-ring" viewBox="0 0 36 36">
            <circle className="caw-ring-bg" cx="18" cy="18" r="15.9" />
            <circle className="caw-ring-fg" cx="18" cy="18" r="15.9"
              style={{ strokeDasharray: `${progress} 100`, stroke: color }} />
          </svg>
          <div className="caw-icon">
            {activity ? <i className="bi bi-activity"></i> : <i className="bi bi-clock"></i>}
          </div>
          {activity && <div className="caw-pulse" style={{ borderColor: color }} />}
        </div>

        {/* Expanded panel */}
        {expanded && (
          <div className="caw-panel" onClick={() => setExpanded(false)}>
            {activity ? (
              <>
                <div className="caw-label">Current Activity</div>
                <div className="caw-title">{activity.title}</div>
                <div className="caw-time-range">
                  {activity.start_time} – {activity.end_time}
                </div>
                <div className="caw-countdown">{timeLeft} left</div>
                <div className="caw-progress-bar">
                  <div className="caw-progress-fill" style={{ width: `${progress}%`, background: color }} />
                </div>
              </>
            ) : nextActivity ? (
              <>
                <div className="caw-label">Next Up</div>
                <div className="caw-title">{nextActivity.title}</div>
                <div className="caw-time-range">
                  starts at {nextActivity.start_time}
                </div>
                <div className="caw-countdown">
                  in {fmtDuration(toMinutes(nextActivity.start_time) - nowMinutes())}
                </div>
              </>
            ) : (
              <>
                <div className="caw-label">All Done</div>
                <div className="caw-title">No more activities today</div>
                <div className="caw-time-range">Great job! 🎉</div>
              </>
            )}
          </div>
      )}
      </div>
    </>
  );
}
