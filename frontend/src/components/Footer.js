import React from "react";

export default function Footer() {
  return (
    <footer className="wb-footer mt-auto py-4">
      <div className="container">
        <div className="row align-items-center">
          <div className="col-md-6 text-center text-md-start mb-2 mb-md-0">
            <span className="text-muted">
              <i className="bi bi-heart-pulse-fill me-2 text-primary"></i>
              &copy; {new Date().getFullYear()} HealthHub — Health &amp; Wellness Platform
            </span>
          </div>
          <div className="col-md-6 text-center text-md-end">
            <span className="text-muted small">
              Built with <i className="bi bi-heart-fill text-danger"></i> for your well-being
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
