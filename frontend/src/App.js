import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CurrentActivityWidget from "./components/CurrentActivityWidget";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import HealthTrackingPage from "./pages/HealthTrackingPage";
import SleepPage from "./pages/SleepPage";
import NutritionPage from "./pages/NutritionPage";
import MoodPage from "./pages/MoodPage";
import GoalsPage from "./pages/GoalsPage";
import JournalPage from "./pages/JournalPage";
import HealthRecordsPage from "./pages/HealthRecordsPage";
import SchedulePage from "./pages/SchedulePage";
import BMITrackerPage from "./pages/BMITrackerPage";
import ProfilePage from "./pages/ProfilePage";
import LoginPage from "./pages/LoginPage";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? children : <Navigate to="/login" replace />;
}

function P({ children }) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}

function GuestRoute({ children }) {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <div className="app-container">
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<GuestRoute><LoginPage /></GuestRoute>} />
          <Route path="/dashboard" element={<P><Dashboard /></P>} />
          <Route path="/health" element={<P><HealthTrackingPage /></P>} />
          <Route path="/sleep" element={<P><SleepPage /></P>} />
          <Route path="/nutrition" element={<P><NutritionPage /></P>} />
          <Route path="/mood" element={<P><MoodPage /></P>} />
          <Route path="/goals" element={<P><GoalsPage /></P>} />
          <Route path="/journal" element={<P><JournalPage /></P>} />
          <Route path="/records" element={<P><HealthRecordsPage /></P>} />
          <Route path="/schedule" element={<P><SchedulePage /></P>} />
          <Route path="/bmi" element={<P><BMITrackerPage /></P>} />
          <Route path="/profile" element={<P><ProfilePage /></P>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <CurrentActivityWidget />
      <Footer />
    </div>
  );
}
