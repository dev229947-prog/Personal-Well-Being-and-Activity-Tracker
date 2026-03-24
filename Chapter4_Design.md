# Chapter 4 — Design

## 4.1 System Architecture
The system is based on a client-server architecture, with a clear separation between the frontend (user interface) and backend (API and data storage). This modularity allows for independent development, testing, and future extensibility, such as supporting mobile clients or third-party integrations.

---

## 4.2 Backend Design

### 4.2.1 Architecture
The backend is implemented using Node.js and Express.js, exposing a RESTful API that handles all business logic, authentication (JWT), and database operations via Sequelize ORM with SQLite. The backend is organized into 11 route modules (auth, schedule, health, sleep, nutrition, mood, workouts, goals, journal, records, BMI), each encapsulating CRUD operations for its domain. All endpoints use JSON and follow REST conventions. The backend also includes a rule-based insights engine that provides personalized feedback based on user activity data.

### 4.2.2 Database
The SQLite database contains 11 tables: user, scheduleentry, healthmetric, sleeplog, nutritionlog, moodlog, workoutlog, goal, journalentry, healthrecord, and weightlog. Each table is linked to the user via the username, and Sequelize manages schema, migrations, and timestamps. The schema uses DATEONLY for dates and STRING for time-of-day, ensuring timezone independence.

### 4.2.3 API
The API is organized into 11 route groups, each mounted at a distinct URL prefix. Each module supports POST (create), GET (retrieve), PUT (update), and DELETE (remove) operations. Endpoints return appropriate HTTP status codes and use JSON for request/response bodies. This design supports modularity, scalability, and future extensibility.

### 4.2.4 Rule-Based Insights Engine
Implements conditional logic to provide personalized feedback for activities such as sleep, coffee, exercise, meditation, and breaks. The engine uses a strategy pattern for easy extensibility and ensures that users always receive actionable feedback.

---

## 4.3 Frontend Design

### 4.3.1 Architecture
The frontend is a React single-page application (SPA) with 14 routes, including public, guest-only, and protected pages. State management is handled using AuthContext and ThemeContext. The frontend communicates with the backend API using Axios for HTTP requests.

### 4.3.2 Pages and Wireframes
Low-fidelity wireframes were produced during the design phase to establish the layout and information hierarchy for each page. These wireframes were reviewed with potential users to gather early feedback before implementation. The following are the main pages, their descriptions, and the corresponding wireframe highlights:

- **Landing Page (/):** The public entry point featuring a hero section with a gradient background, application title, descriptive text, and call-to-action buttons. Below, a motivational banner image is followed by a features grid displaying cards for each trackable wellness dimension with icons and descriptions. (Wireframe: Figure 4)
- **Login Page (/login):** Dual-purpose form for signup and login. Guest-only; authenticated users are redirected to the dashboard. The form is simple, with fields for username, email, and password, and toggles between login and registration modes.
- **Dashboard (/dashboard):** The main authenticated view, aggregating data from seven API sources. Displays eight KPI summary cards (e.g., Wellness Score, Current Streak, Average Sleep), a two-column grid of chart panels (Wellness Radar, Workout Pie, Mood Trend, Sleep Trend, Goal Progress, Today's Schedule), quick-navigation links, and a floating activity widget overlay. (Wireframe: Figure 5)
- **Health Tracking (/health):** Dedicated page for logging and viewing general health metrics such as steps, heart rate, and calories, with date-based tabular history.
- **Sleep (/sleep):** Detailed sleep logging page capturing total hours, quality rating, sleep stage breakdown (REM, deep, light), and notes with historical chart display.
- **Nutrition (/nutrition):** Meal-by-meal logging page capturing meal type, description, calorie count, macronutrients (protein, carbs, fat), and water intake.
- **Mood (/mood):** Daily mood tracking page with mood score, stress level, energy level, mindfulness minutes, and notes with trend visualization.
- **Goals (/goals):** Goal-setting and progress tracking page displaying goals with progress bars, status indicators, deadlines, and the ability to update current values.
- **Journal (/journal):** Reflective journaling page with rich text entries, mood tags, and searchable tag-based filtering.
- **Health Records (/records):** Management page for medical appointments, medications, vaccinations, and recurring health events.
- **Schedule (/schedule):** Interactive weekly schedule page featuring a seven-column grid (Monday–Sunday) with time-slot rows, colour-coded activity blocks, hover-overlay action buttons, and a side panel for adding/editing entries with template selection. Supports both desktop grid and mobile list views. (Wireframe: Figure 6)
- **BMI Tracker (/bmi):** Weight and BMI tracking page with automatic BMI calculation, calorie balance tracking, and historical trend chart.
- **Profile (/profile):** Displays user information, theme preference controls, and logout functionality.
- **Catch-all Redirect:** Redirects users to a default page for undefined routes.

### 4.3.3 Components
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

### 4.3.4 UI/UX
The frontend uses Bootstrap 5 for responsive design, supports light/dark themes, and implements access control via ProtectedRoute and GuestRoute wrappers. Data visualization is handled with Recharts, and the interface is designed for clarity and ease of use.

---

## 4.4 Technology Stack Justification

The technology stack was chosen to best meet the project’s requirements for rapid development, modularity, scalability, and maintainability. The developer’s familiarity with these technologies also contributed to efficient implementation and reduced learning overhead.

**Frontend on React:** React was selected not only for its component-based architecture and the developer’s experience, but also because it offers a large ecosystem of mature libraries (such as React Router for routing and Recharts for data visualization), strong community support, and excellent documentation. React’s virtual DOM enables efficient updates and smooth user experiences, which is especially important for dynamic interfaces like dashboards and activity logs. Its unidirectional data flow and state management patterns (e.g., Context API) help maintain predictable application behavior, making it easier to debug and scale the application as new features are added. The popularity of React ensures long-term maintainability and availability of resources or third-party integrations. Additionally, React’s modularity allows for the development of reusable UI components, such as the activity form, insights panel, charts, and navigation, supporting a clean and maintainable codebase.

**Backend on Express.js (Node.js):** Express.js was chosen for its minimalism, flexibility, and the advantage of using JavaScript across both frontend and backend, which avoids the need to switch between different programming languages during development. Its extensive middleware ecosystem (for CORS, JSON parsing, authentication, etc.) and strong support for integration with ORMs like Sequelize enable rapid API development. Express.js, combined with Node.js’s event-driven, non-blocking I/O model, efficiently handles concurrent API requests, making it suitable for scalable web applications.

**Database: SQLite with Sequelize ORM:** SQLite is a lightweight, serverless relational database that requires no external installation or configuration, making it ideal for prototyping and moderate data volumes. Sequelize ORM is a popular JavaScript library that abstracts SQL queries, allowing developers to define models, perform queries, and manage migrations using JavaScript. This reduces the need for direct SQL access and accelerates development. The combination of SQLite and Sequelize provides both simplicity and sufficient functionality for a multi-table wellness tracking system.

**Authentication: JWT with bcryptjs:** Authentication is implemented using JSON Web Tokens (JWT) via the jsonwebtoken npm package, which enables stateless authentication—ideal for single-page applications as it allows secure user sessions without maintaining server-side session state. Passwords are securely hashed using bcryptjs, which applies a configurable number of salt rounds to protect against brute-force attacks. This approach ensures that user authentication is both secure and scalable, aligning with industry best practices for web application security.

**Data Visualization on Recharts:** Recharts is a React-based charting library built on D3.js, supporting interactive bar and line charts with minimal configuration. It was selected for its seamless integration with React components, ease of use, and ability to visualize trends in user activity, which is essential for the project’s focus on actionable insights and user engagement.
