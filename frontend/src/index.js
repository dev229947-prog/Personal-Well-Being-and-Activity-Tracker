import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

/* ── Bootstrap (npm) ── */
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

/* ── Modular Stylesheets (order matters — loaded AFTER Bootstrap to override) ── */
import "./styles/variables.css";
import "./styles/base.css";
import "./styles/buttons.css";
import "./styles/cards.css";
import "./styles/forms.css";
import "./styles/hero.css";
import "./styles/navbar.css";
import "./styles/footer.css";
import "./styles/schedule.css";
import "./styles/widget.css";
import "./styles/goals.css";
import "./styles/utilities.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);
