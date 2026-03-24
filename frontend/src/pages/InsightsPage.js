import React from "react";
import InsightsPanel from "../components/InsightsPanel";

export default function InsightsPage() {
  return (
    <div className="container py-4">
      <h2 className="wb-page-header mb-2">
        <i className="bi bi-lightbulb me-2"></i>Insights
      </h2>
      <p className="text-muted mb-4">
        Enter an activity type and value to receive a personalized, rule-based
        insight about your well-being.
      </p>

      {/* Banner */}
      <img
        className="wb-banner w-100 mb-4"
        src="https://images.unsplash.com/photo-1493836512294-502baa1986e2?w=1600&h=400&fit=crop"
        alt="Data insights and analytics"
      />

      <div className="row">
        <div className="col-lg-7">
          <InsightsPanel />
        </div>
        <div className="col-lg-5 mt-4 mt-lg-0">
          <img
            className="wb-banner wb-banner-lg w-100"
            src="https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&h=500&fit=crop"
            alt="Wellness and calm"
          />
        </div>
      </div>
    </div>
  );
}
