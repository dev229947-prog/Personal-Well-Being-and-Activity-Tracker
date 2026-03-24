import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { login as apiLogin, signup as apiSignup } from "../services/api";

export default function LoginPage() {
  const [isSignup, setIsSignup] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSignup) {
        await apiSignup(username, email, password);
        const tokenData = await apiLogin(username, password);
        login({ username, email }, tokenData.access_token);
      } else {
        const tokenData = await apiLogin(username, password);
        login({ username }, tokenData.access_token);
      }
      navigate("/dashboard");
    } catch (err) {
      const detail = err.response?.data?.detail;
      setError(detail || "Authentication failed. Is the backend running?");
    }
    setLoading(false);
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-5 col-md-7">
          {/* Banner above card */}
          <img
            className="wb-banner w-100 mb-4"
            src="https://images.unsplash.com/photo-1499728603263-13726abce5fd?w=800&h=300&fit=crop"
            alt="Mindful morning"
          />

          <div className="wb-auth-card">
            {/* Gradient header */}
            <div className="wb-auth-header">
              <i className="bi bi-heart-pulse-fill fs-1 mb-2 d-block"></i>
              <h3 className="fw-bold mb-0">
                {isSignup ? "Create Account" : "Welcome Back"}
              </h3>
              <p className="mb-0 mt-1 small wb-hero-subtitle">
                {isSignup
                  ? "Start your well-being journey today"
                  : "Log in to continue tracking your habits"}
              </p>
            </div>

            {/* Form body */}
            <div className="p-4">
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-person me-1"></i>Username
                  </label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    placeholder="Enter username"
                  />
                </div>

                {isSignup && (
                  <div className="mb-3">
                    <label className="form-label">
                      <i className="bi bi-envelope me-1"></i>Email
                    </label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      placeholder="Enter email"
                    />
                  </div>
                )}

                <div className="mb-3">
                  <label className="form-label">
                    <i className="bi bi-lock me-1"></i>Password
                  </label>
                  <input
                    type="password"
                    className="form-control form-control-lg"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter password"
                  />
                </div>

                {error && (
                  <div className="alert alert-danger py-2 small">
                    <i className="bi bi-exclamation-triangle me-1"></i>{error}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-wb-primary w-100 btn-lg"
                  disabled={loading}
                >
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-2"></span>Please wait...</>
                  ) : isSignup ? (
                    <><i className="bi bi-person-plus me-2"></i>Sign Up</>
                  ) : (
                    <><i className="bi bi-box-arrow-in-right me-2"></i>Login</>
                  )}
                </button>
              </form>

              <div className="text-center mt-3">
                {isSignup ? (
                  <p className="mb-0 small">
                    Already have an account?{" "}
                    <button
                      className="btn btn-link p-0 fw-semibold"
                      onClick={() => { setIsSignup(false); setError(""); }}
                    >
                      Login
                    </button>
                  </p>
                ) : (
                  <p className="mb-0 small">
                    Don't have an account?{" "}
                    <button
                      className="btn btn-link p-0 fw-semibold"
                      onClick={() => { setIsSignup(true); setError(""); }}
                    >
                      Sign Up
                    </button>
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
