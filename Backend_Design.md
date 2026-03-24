# Backend Design

## Architecture
The backend is implemented using Node.js and Express.js, exposing a RESTful API that handles all business logic, authentication (JWT), and database operations via Sequelize ORM with SQLite. The backend is organized into 11 route modules (auth, schedule, health, sleep, nutrition, mood, workouts, goals, journal, records, BMI), each encapsulating CRUD operations for its domain. All endpoints use JSON and follow REST conventions. The backend also includes a rule-based insights engine that provides personalized feedback based on user activity data.

## Database
The SQLite database contains 11 tables: user, scheduleentry, healthmetric, sleeplog, nutritionlog, moodlog, workoutlog, goal, journalentry, healthrecord, and weightlog. Each table is linked to the user via the username, and Sequelize manages schema, migrations, and timestamps. The schema uses DATEONLY for dates and STRING for time-of-day, ensuring timezone independence.

## API
The API is organized into 11 route groups, each mounted at a distinct URL prefix. Each module supports POST (create), GET (retrieve), PUT (update), and DELETE (remove) operations. Endpoints return appropriate HTTP status codes and use JSON for request/response bodies. This design supports modularity, scalability, and future extensibility.

## Rule-Based Insights Engine
Implements conditional logic to provide personalized feedback for activities such as sleep, coffee, exercise, meditation, and breaks. The engine uses a strategy pattern for easy extensibility and ensures that users always receive actionable feedback.
