## Getting Started

### Node.js & NVM Setup

It is recommended to use [NVM (Node Version Manager)](https://github.com/nvm-sh/nvm) to manage Node.js versions, especially if you work on multiple Node.js projects.

#### Install NVM (Windows)

1. Download and install [nvm-windows](https://github.com/coreybutler/nvm-windows/releases).
2. Open a new terminal and run:
	```bash
	nvm install 24.13.0
	nvm use 24.13.0
	```
3. Verify installation:
	```bash
	node -v
	npm -v
	```
	You should see Node.js v24.13.0 and npm version output.

> **Note:** Node.js 24.13.0 can be downloaded directly from the [official Node.js archive](https://nodejs.org/en/download/archive/v24.13.0) if you prefer a manual installation.

> 

---

## Backend Setup


1. Open a terminal and navigate to the backend folder:
	```bash
	cd backend
	npm install
	```
2. Run database migration:
	```bash
	npm run migrate
	```
3. Start the backend server:
	- For development (auto-reload):
	  ```bash
	  npm run dev
	  ```
	- For production:
	  ```bash
	  npm start
	  ```

The API will be running at [http://localhost:8000](http://localhost:8000).


## Frontend Setup

1. Open a new terminal and navigate to the frontend folder:
	```bash
	cd frontend
	npm install
	npm start
	```

The app will open at [http://localhost:3000](http://localhost:3000).

## API Endpoints

| Method | Endpoint                          | Description                    |
| ------ | --------------------------------- | ------------------------------ |
| POST   | `/auth/signup`                    | Create a new user account      |
| POST   | `/auth/login`                     | Login and receive JWT token    |
| POST   | `/activities/`                    | Log a new activity             |
| GET    | `/activities/{user_name}`         | Get all activities for a user  |
| GET    | `/insights/{activity_type}/{value}` | Get rule-based insight       |

## Rules Engine

| Activity   | Condition | Insight |
| ---------- | --------- | ------- |
| Sleep      | < 6 hrs   | You may feel tired today. Try to get more rest. |
| Sleep      | 6–9 hrs   | Your sleep is within healthy range. Good job! |
| Sleep      | > 9 hrs   | You had plenty of rest. Your energy levels should be high. |
| Coffee     | ≤ 3 cups  | Coffee intake is moderate. |
| Coffee     | > 3 cups  | Too much coffee may affect sleep later. |
| Exercise   | < 30 min  | A short exercise is better than none. Keep it up! |
| Exercise   | ≥ 30 min  | Great job exercising today! Energy and mood should improve. |

