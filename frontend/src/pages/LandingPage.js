import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function LandingPage() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="container py-4">
      {/* Hero Section */}
      <section className="wb-hero text-center px-4 py-5 mb-5">
        <div className="wb-hero-content">
          <h1 className="display-4 fw-bold mb-3">
            Your Complete Health &amp;<br />Wellness Platform
          </h1>
          <p className="lead mx-auto mb-4 wb-hero-subtitle">
            Track fitness, sleep, nutrition, mood, and more. Set goals, journal your journey,
            and gain powerful insights with beautiful analytics — all in one place.
          </p>
          <div className="d-flex gap-3 justify-content-center flex-wrap">
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="btn btn-wb-accent btn-lg px-4">
                  <i className="bi bi-speedometer2 me-2"></i>Go to Dashboard
                </Link>
                <Link to="/health" className="btn btn-wb-outline btn-lg px-4">
                  <i className="bi bi-heart-pulse me-2"></i>Start Tracking
                </Link>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-wb-accent btn-lg px-4">
                  <i className="bi bi-rocket-takeoff me-2"></i>Get Started Free
                </Link>
                <Link to="/login" className="btn btn-wb-outline btn-lg px-4">
                  <i className="bi bi-box-arrow-in-right me-2"></i>Login
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Banner */}
      <img
        className="wb-banner w-100 mb-5"
        src="https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=1600&h=400&fit=crop"
        alt="Health and wellness"
      />

      {/* Features Section */}
      <div className="text-center mb-4">
        <h2 className="fw-bold wb-page-header">Comprehensive Health Tracking</h2>
        <p className="text-muted mx-auto wb-subtitle">
          Everything you need to monitor, analyze, and improve your well-being.
        </p>
      </div>

      <div className="row g-4 mb-5">
        {[
          { icon: "bi-heart-pulse", colorCls: "text-wb-danger", bgCls: "bg-wb-danger-soft", title: "Health & Fitness", desc: "Log workouts, track steps, calories burned, and monitor your physical health metrics over time." },
          { icon: "bi-moon-stars", colorCls: "text-wb-primary", bgCls: "bg-wb-primary-soft", title: "Sleep Analysis", desc: "Track sleep duration, quality, REM/deep/light stages, and discover patterns for better rest." },
          { icon: "bi-egg-fried", colorCls: "text-wb-success", bgCls: "bg-wb-success-soft", title: "Nutrition Tracking", desc: "Log meals with macros (protein, carbs, fat), track calories, and monitor hydration." },
          { icon: "bi-emoji-smile", colorCls: "text-wb-accent", bgCls: "bg-wb-accent-soft", title: "Mood & Mental Health", desc: "Rate your mood, energy, stress levels, and track mindfulness minutes daily." },
          { icon: "bi-trophy", colorCls: "text-wb-purple", bgCls: "bg-wb-purple-soft", title: "Goals & Milestones", desc: "Set fitness, nutrition, and wellness goals with progress tracking and completion badges." },
          { icon: "bi-journal-richtext", colorCls: "text-wb-info", bgCls: "bg-wb-info-soft", title: "Daily Journal", desc: "Write reflections, tag your mood, and build a journaling streak for mindfulness." },
          { icon: "bi-calendar-week", colorCls: "text-wb-primary", bgCls: "bg-wb-primary-soft", title: "Weekly Schedule", desc: "Plan your weekly activities with a visual timetable and built-in activity timer." },
          { icon: "bi-graph-up-arrow", colorCls: "text-wb-danger", bgCls: "bg-wb-danger-soft", title: "Rich Analytics", desc: "Pie charts, line trends, radar charts, bar graphs, KPI cards, and data tables." },
          { icon: "bi-clipboard2-pulse", colorCls: "text-wb-success", bgCls: "bg-wb-success-soft", title: "Health Records", desc: "Track appointments, vaccines, medications, and get upcoming reminders." },
        ].map((f, i) => (
          <div className="col-md-6 col-lg-4" key={i}>
            <div className="wb-card p-4 h-100 text-center">
              <div className={`wb-feature-icon mx-auto ${f.bgCls} ${f.colorCls}`}>
                <i className={`bi ${f.icon}`}></i>
              </div>
              <h5 className="fw-bold mt-3">{f.title}</h5>
              <p className="text-muted mb-0 small">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Second Banner */}
      <img
        className="wb-banner w-100 mb-5"
        src="https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1600&h=400&fit=crop"
        alt="Peaceful nature meditation"
      />

      {/* CTA Section */}
      <section className="wb-hero text-center px-4 py-5">
        <div className="wb-hero-content">
          <h2 className="display-6 fw-bold mb-3">Ready to Transform Your Health?</h2>
          <p className="lead mb-4 wb-hero-subtitle">
            Join and take control of your wellness journey with data-driven insights and beautiful visualizations.
          </p>
          <Link
            to={isAuthenticated ? "/dashboard" : "/login"}
            className="btn btn-wb-accent btn-lg px-5"
          >
            <i className="bi bi-arrow-right-circle me-2"></i>
            {isAuthenticated ? "Go to Dashboard" : "Start Now — It's Free"}
          </Link>
        </div>
      </section>
    </div>
  );
}
