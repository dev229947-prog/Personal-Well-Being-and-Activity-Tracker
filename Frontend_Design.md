# Frontend Design

## Architecture
The frontend is a React single-page application (SPA) with 14 routes, including public, guest-only, and protected pages. State management is handled using AuthContext and ThemeContext. The frontend communicates with the backend API using Axios for HTTP requests.


## Pages and Wireframes

Low-fidelity wireframes were produced during the design phase to establish the layout and information hierarchy for each page. These wireframes were reviewed with potential users to gather early feedback before implementation. The following are the main pages, their descriptions, and the corresponding wireframe highlights:

### Landing Page (/)
**Description:** The public entry point featuring a hero section with a gradient background, application title, descriptive text, and call-to-action buttons. Below, a motivational banner image is followed by a features grid displaying cards for each trackable wellness dimension with icons and descriptions.

**Wireframe:** Figure 4 — Landing Page Wireframe

---

### Login Page (/login)
**Description:** Dual-purpose form for signup and login. Guest-only; authenticated users are redirected to the dashboard. The form is simple, with fields for username, email, and password, and toggles between login and registration modes.

---

### Dashboard (/dashboard)
**Description:** The main authenticated view, aggregating data from seven API sources. Displays eight KPI summary cards (e.g., Wellness Score, Current Streak, Average Sleep), a two-column grid of chart panels (Wellness Radar, Workout Pie, Mood Trend, Sleep Trend, Goal Progress, Today's Schedule), quick-navigation links, and a floating activity widget overlay.

**Wireframe:** Figure 5 — Dashboard Wireframe

---

### Health Tracking (/health)
**Description:** Dedicated page for logging and viewing general health metrics such as steps, heart rate, and calories, with date-based tabular history.

---

### Sleep (/sleep)
**Description:** Detailed sleep logging page capturing total hours, quality rating, sleep stage breakdown (REM, deep, light), and notes with historical chart display.

---

### Nutrition (/nutrition)
**Description:** Meal-by-meal logging page capturing meal type, description, calorie count, macronutrients (protein, carbs, fat), and water intake.

---

### Mood (/mood)
**Description:** Daily mood tracking page with mood score, stress level, energy level, mindfulness minutes, and notes with trend visualization.

---

### Goals (/goals)
**Description:** Goal-setting and progress tracking page displaying goals with progress bars, status indicators, deadlines, and the ability to update current values.

---

### Journal (/journal)
**Description:** Reflective journaling page with rich text entries, mood tags, and searchable tag-based filtering.

---

### Health Records (/records)
**Description:** Management page for medical appointments, medications, vaccinations, and recurring health events.

---

### Schedule (/schedule)
**Description:** Interactive weekly schedule page featuring a seven-column grid (Monday–Sunday) with time-slot rows, colour-coded activity blocks, hover-overlay action buttons, and a side panel for adding/editing entries with template selection. Supports both desktop grid and mobile list views.

**Wireframe:** Figure 6 — Schedule Page Wireframe

---

### BMI Tracker (/bmi)
**Description:** Weight and BMI tracking page with automatic BMI calculation, calorie balance tracking, and historical trend chart.

---

### Profile (/profile)
**Description:** Displays user information, theme preference controls, and logout functionality.

---

### Catch-all Redirect
**Description:** Redirects users to a default page for undefined routes.

---

## Components
The frontend features 14+ reusable components, including:
- Navbar (responsive navigation, theme toggle, authentication-aware rendering)
- Footer (consistent site footer)
- CurrentActivityWidget (floating widget showing current/next activity)
- Charts (seven chart types using Recharts)
- KPICards (dashboard summary cards)
- DataTable (sortable data tables)
- GoalProgress (progress bars for goals)
- StreakTracker (current tracking streak)
- WeeklySchedule (interactive schedule grid/list)
- ScheduleForm (form for schedule entries)
- ActivityForm (simple activity logging)
- ActivityLog (activity history)
- InsightsPanel (fetch/display rule-based insights)
- ActivityTimer (track activity duration)

## UI/UX
The frontend uses Bootstrap 5 for responsive design, supports light/dark themes, and implements access control via ProtectedRoute and GuestRoute wrappers. Data visualization is handled with Recharts, and the interface is designed for clarity and ease of use.
