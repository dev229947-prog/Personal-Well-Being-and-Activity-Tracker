import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";

import { getHealthRecords, getGoals } from "../services/api";

export default function Navbar() {
  const { darkMode, toggleTheme } = useTheme();
  const { isAuthenticated, user, logout } = useAuth();
  const location = useLocation();
  const [showTracking, setShowTracking] = useState(false);

  // Notifications state
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifs, setNotifs] = useState([]);
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated || !user?.username) return;
    async function fetchNotifs() {
      try {
        const uname = user.username;
        // Get upcoming appointments (health records)
        const records = await getHealthRecords(uname);
        const today = new Date();
        const upcomingAppts = (records || []).filter(r => r.record_type === "appointment" && r.status === "upcoming" && new Date(r.record_date) >= today)
          .sort((a, b) => new Date(a.record_date) - new Date(b.record_date))
          .slice(0, 5)
          .map(r => ({
            type: "appointment",
            id: r.id,
            title: r.title,
            date: r.record_date,
            provider: r.provider,
            link: "/records",
          }));
        // Get active goals with deadlines
        const goals = await getGoals(uname);
        const upcomingGoals = (goals || [])
          .filter(g => g.status === "active" && g.deadline && new Date(g.deadline) >= today)
          .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
          .slice(0, 5)
          .map(g => ({
            type: "goal",
            id: g.id,
            title: g.title,
            date: g.deadline,
            provider: null,
            link: "/goals",
          }));
        const all = [...upcomingAppts, ...upcomingGoals].sort((a, b) => new Date(a.date) - new Date(b.date));
        setNotifs(all);
        setNotifCount(all.length);
      } catch (e) { setNotifs([]); setNotifCount(0); }
    }
    fetchNotifs();
  }, [isAuthenticated, user]);

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar navbar-expand-lg sticky-top py-2">
      <div className="container">
        <Link to="/" className="navbar-brand d-flex align-items-center gap-2">
          <i className="bi bi-heart-pulse-fill fs-4"></i>
          HealthHub
        </Link>

        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
          style={{ color: "#fff" }}
        >
          <i className="bi bi-list fs-3"></i>
        </button>

        <div className="collapse navbar-collapse" id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-center gap-1">
            {!isAuthenticated && (
              <li className="nav-item">
                <Link to="/" className={`nav-link ${isActive("/")}`}>
                  <i className="bi bi-house-door me-1"></i>Home
                </Link>
              </li>
            )}

            {isAuthenticated && (
              <>
                <li className="nav-item">
                  <Link to="/dashboard" className={`nav-link ${isActive("/dashboard")}`}>
                    <i className="bi bi-speedometer2 me-1"></i>Dashboard
                  </Link>
                </li>

                {/* Tracking Dropdown */}
                <li className="nav-item dropdown" onMouseEnter={() => setShowTracking(true)} onMouseLeave={() => setShowTracking(false)}>
                  <span className={`nav-link dropdown-toggle ${["/health", "/sleep", "/nutrition", "/mood", "/records"].includes(location.pathname) ? "active" : ""}`}
                    role="button" data-bs-toggle="dropdown" style={{ cursor: "pointer" }}>
                    <i className="bi bi-clipboard2-pulse me-1"></i>Tracking
                  </span>
                  <ul className={`dropdown-menu${showTracking ? " show" : ""}`}>
                    <li><Link className="dropdown-item" to="/health"><i className="bi bi-heart-pulse me-2"></i>Health & Fitness</Link></li>
                    <li><Link className="dropdown-item" to="/sleep"><i className="bi bi-moon-stars me-2"></i>Sleep</Link></li>
                    <li><Link className="dropdown-item" to="/nutrition"><i className="bi bi-egg-fried me-2"></i>Nutrition</Link></li>
                    <li><Link className="dropdown-item" to="/mood"><i className="bi bi-emoji-smile me-2"></i>Mood & Mental</Link></li>
                    <li><Link className="dropdown-item" to="/bmi"><i className="bi bi-speedometer me-2"></i>BMI & Weight</Link></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><Link className="dropdown-item" to="/records"><i className="bi bi-clipboard2-pulse me-2"></i>Health Records</Link></li>
                  </ul>
                </li>

                <li className="nav-item">
                  <Link to="/schedule" className={`nav-link ${isActive("/schedule")}`}>
                    <i className="bi bi-calendar-week me-1"></i>Schedule
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/goals" className={`nav-link ${isActive("/goals")}`}>
                    <i className="bi bi-trophy me-1"></i>Goals
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/journal" className={`nav-link ${isActive("/journal")}`}>
                    <i className="bi bi-journal-richtext me-1"></i>Journal
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/profile" className={`nav-link ${isActive("/profile")}`}>
                    <i className="bi bi-person me-1"></i>Profile
                  </Link>
                </li>
              </>
            )}

            {/* Notifications Bell */}
            {isAuthenticated && (
              <li className="nav-item position-relative ms-lg-2" style={{ zIndex: 1050 }}>
                <button
                  className="btn btn-link nav-link position-relative px-2"
                  style={{ fontSize: "1.3rem" }}
                  onClick={() => setNotifOpen(v => !v)}
                  aria-label="Notifications"
                >
                  <i className="bi bi-bell"></i>
                  {notifCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger" style={{ fontSize: 10 }}>
                      {notifCount}
                    </span>
                  )}
                </button>
                {notifOpen && (
                  <div className="dropdown-menu show p-0 mt-2" style={{ minWidth: 320, right: 0, left: 'auto', maxHeight: 350, overflowY: 'auto' }}>
                    <div className="p-3 border-bottom fw-bold bg-light">Notifications</div>
                    {notifs.length === 0 && <div className="p-3 text-muted small">No upcoming appointments or goals.</div>}
                    {notifs.map((n, i) => (
                      <Link to={n.link} className="dropdown-item d-flex align-items-center gap-2 py-2" key={n.type + n.id + i} onClick={() => setNotifOpen(false)}>
                        <i className={`bi ${n.type === "appointment" ? "bi-calendar-event text-info" : "bi-trophy text-warning"}`} style={{ fontSize: 18 }}></i>
                        <div className="flex-fill">
                          <div className="fw-bold small">{n.title}</div>
                          <div className="text-muted" style={{ fontSize: 12 }}>
                            {new Date(n.date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                            {n.provider && ` · ${n.provider}`}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                )}
              </li>
            )}

            <li className="nav-item ms-lg-2">
              <button className="btn btn-sm btn-wb-outline" onClick={toggleTheme}>
                {darkMode ? (
                  <><i className="bi bi-sun-fill me-1"></i>Light</>
                ) : (
                  <><i className="bi bi-moon-stars-fill me-1"></i>Dark</>
                )}
              </button>
            </li>

            <li className="nav-item ms-lg-1">
              {isAuthenticated ? (
                <button className="btn btn-sm btn-wb-outline" onClick={logout}>
                  <i className="bi bi-box-arrow-right me-1"></i>
                  {user?.username}
                </button>
              ) : (
                <Link to="/login" className={`nav-link ${isActive("/login")}`}>
                  <i className="bi bi-box-arrow-in-right me-1"></i>Login
                </Link>
              )}
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
