import React, { useState } from "react";
import ActivityForm from "../components/ActivityForm";

export default function AddActivityPage() {
  const [recentActivity, setRecentActivity] = useState(null);

  return (
    <div className="container py-4">
      <h2 className="wb-page-header mb-4">
        <i className="bi bi-plus-circle me-2"></i>Add Activity
      </h2>

      {/* Banner */}
      <img
        className="wb-banner w-100 mb-4"
        src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1600&h=400&fit=crop"
        alt="Exercise and wellness"
      />

      <div className="row">
        <div className="col-lg-6">
          <ActivityForm onAdd={(activity) => setRecentActivity(activity)} />
        </div>

        <div className="col-lg-6 mt-4 mt-lg-0">
          {/* Motivational image */}
          <img
            className="wb-banner wb-banner-sm w-100 mb-4"
            src="https://images.unsplash.com/photo-1545205597-3d9d02c29597?w=800&h=400&fit=crop"
            alt="Healthy lifestyle"
          />

          {recentActivity ? (
            <div className="wb-insight-card p-4">
              <h5 className="fw-bold text-wb-accent">
                <i className="bi bi-check-circle-fill me-2"></i>Last Logged
              </h5>
              <p className="mb-0">
                <strong>{recentActivity.activity_type}</strong> — {recentActivity.value}{" "}
                on {new Date(recentActivity.timestamp).toLocaleString()}
              </p>
            </div>
          ) : (
            <div className="wb-card-static p-4 text-center text-muted">
              <i className="bi bi-journal-plus fs-1 d-block mb-2"></i>
              <p className="mb-0">Your recently logged activity will appear here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
