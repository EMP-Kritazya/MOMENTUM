# Momentum

CodePath WEB103 Final Project

Designed and developed by Kritazya Upreti, Johan Almanzar, Ngoc (Vy) Pham,
and Joy Tran.

- Deployed site: https://momentum-z1ob.onrender.com/

# About

## Description and Purpose

Momentum is a full-stack fitness consistency platform designed to help beginners and casual gym-goers build sustainable workout habits. Rather than overwhelming users with hundreds of exercise options, Momentum removes decision fatigue by generating personalized daily workout plans based on each user's goals, experience level, available equipment, and weekly schedule.

The app emphasizes long-term consistency over perfection. Users can track their progress through workout history, streaks, and personalized motivational insights while participating in small accountability groups that encourage members to stay committed without the distractions of a traditional social media platform.

Our goal is to make working out feel simple, approachable, and rewarding so that users develop lasting fitness habits.

---

## Inspiration

Many fitness apps assume users already know how to structure workouts, understand proper training splits, or stay motivated independently. For beginners, this often creates analysis paralysis and causes them to lose consistency before building a routine.

Momentum is inspired by habit-building products such as Duolingo and GitHub contribution streaks, combined with the simplicity of having a personal coach who tells you exactly what to do each day. Instead of rewarding users for lifting the most weight, Momentum celebrates consistency, progress, and small daily victories.

---

## Tech stack

### Frontend

- React
- React Router
- Tailwind CSS
- Vite

### Backend

- Node.js
- Express
- PostgreSQL
- JWT authentication in httpOnly cookies

## Completed features

### ✅ Personalized onboarding

Members complete a multi-step form that collects their profile, fitness goal,
experience level, workout location, equipment, and weekly commitment. The
server validates submitted values before saving them and authenticates the new
member with an httpOnly cookie.

https://github.com/user-attachments/assets/5eeecaef-6076-4e73-8bdc-24f106df94a4

### ✅ Daily Workout Generator

Each day, users receive a personalized workout generated from the exercise database using their preferences and workout history. The app removes the need to manually plan workouts, helping users stay focused on consistency rather than deciding what to do.

<!-- TODO: Replace this comment with the uploaded Accountability Groups GIF. -->

### ✅ Workout Progress Dashboard

The home dashboard displays workout streaks, weekly progress, completed workouts, achievement milestones, and personalized motivational messages based on each user's fitness journey.

<!-- TODO: Replace this comment with the uploaded Accountability Groups GIF. -->

### ✅ Workout History Management

Users can view, update, and remove completed workout logs, allowing them to maintain an accurate record of their fitness progress.

<img width="1389" height="673" alt="history_demo" src="https://github.com/user-attachments/assets/5f8a7843-5921-4a74-9a8e-3efdcc4b92f2" />

### ✅ Accountability groups

Authenticated members can create a group, receive an invite code, join another
group, see member streak and daily-completion information, and leave a group.
Group administrators can update or delete only groups they administer.

<!-- TODO: Replace this comment with the uploaded Accountability Groups GIF. -->

### ✅ Exercise Library

Users can browse a searchable exercise database containing exercise descriptions, target muscle groups, difficulty levels, and equipment requirements.

<img src='./milestones/gifs/ExerciseLibraryDemo.gif' title='Video Walkthrough' alt='Video Walkthrough' />

### ✅ Administrator authentication and authorization

Administrators can log in with server-validated credentials. Protected
exercise mutations require both a valid authentication cookie and the
administrator role.

<!-- TODO: Replace this comment with the uploaded administrator GIF. -->

### ✅ Workout-history filtering and detail modal

The workout-history interface supports status and muscle filters, date sorting,
pagination, responsive table/card views, error states, and a same-page workout
detail modal.

<img width="1389" height="673" alt="history_demo" src="https://github.com/user-attachments/assets/5f8a7843-5921-4a74-9a8e-3efdcc4b92f2" />


---

## Exercise Library

Users can browse a searchable exercise database containing exercise descriptions, target muscle groups, difficulty levels, and equipment requirements.

<img src='./milestones/gifs/ExerciseLibraryDemo.gif' title='Video Walkthrough' alt='Video Walkthrough' />

---

## Workout Detail Modal (Custom Feature)

Clicking on any workout opens a slide-out panel or modal displaying the complete workout plan, including exercises, recommended sets, repetitions, estimated duration, and targeted muscle groups without navigating away from the dashboard.

[gif goes here]

---

## Workout Filtering & Sorting (Custom Feature)

Users can filter workouts by duration, muscle group, equipment, or difficulty and sort workouts based on recency or completion status.

[gif goes here]

---

## Automatic Starter Plan Generation (Custom Feature)

Immediately after account creation, Momentum automatically generates a personalized Week 1 workout plan using the information collected during onboarding.

[gif goes here]

---

## Input Validation (Custom Feature)

All workout plans, workout logs, and onboarding responses are validated before being saved to the database. Invalid or incomplete submissions display clear feedback without modifying stored data.

[gif goes here]

---

# Stretch Features

- User authentication using JWT or session-based login
- Protected routes for authenticated users
- Loading spinners while workout plans and dashboard data are being generated
- Disable buttons during form submissions to prevent duplicate requests
- Toast notifications confirming successful actions (workout completed, profile updated, workout generated, etc.)
- Upload progress photos to cloud storage
- Personalized monthly "Momentum Recap" summarizing workout statistics, streaks, achievements, and progress
- Adaptive workout recommendations that reduce workout intensity after extended inactivity and gradually increase difficulty as consistency improves
- Achievement badges for consistency milestones (7-day streak, First Month, 50 Workouts, Never Miss a Monday, etc.)
- Smart motivational messages generated based on each user's recent progress and workout history

---

# Installation Instructions
## Features still in progress

- Connecting the dashboard prototype to live API data
- Completing the Exercise Library interface
- Generating personalized daily workouts and starter plans
- Adding complete frontend controls for workout creation, updates, and deletion

These features are intentionally not presented as completed grading features.

## Database relationships

Momentum includes:

- One-to-many: one user has many workout sessions.
- Many-to-many: users belong to accountability groups through `GroupMembers`.
- Many-to-many: workout templates contain exercises through
  `WorkoutTemplateExercises`.
- Unique join-table membership: `UNIQUE(group_id, user_id)` prevents duplicate
  accountability-group membership.

## API highlights

- RESTful GET, POST, PATCH, and DELETE endpoints for users, exercises, workout
  templates, workout sessions, and accountability groups.
- Custom `POST /api/groups/join` endpoint for invite-code membership.
- Server-side onboarding validation with safe error responses.
- Authenticated identity derived from a signed cookie instead of browser-sent
  user IDs.
- Group-level authorization through `GroupMembers.is_admin`.

## Local installation

1. Clone the repository and install dependencies.

```bash
git clone <repository-url>
cd MOMENTUM/client
npm install
cd ../server
npm install
```

2. Create `server/.env` with the required local values.

```env
PGUSER=your_postgres_user
PGPASSWORD=your_postgres_password
PGHOST=localhost
PGPORT=5432
PGDATABASE=your_database
PGSSL=false
JWT_SECRET=replace_with_a_long_random_secret
ADMIN_USERNAME=admin
ADMIN_FIRST_NAME=Momentum
ADMIN_LAST_NAME=Admin
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=replace_with_a_secure_password
CLIENT_URL=http://localhost:5173
```

3. Reset and seed the local database intentionally.

```bash
cd server
npm run reset
```

This command deletes existing application data. Do not use it against a
production database.

4. Start the backend.

```bash
npm run dev
```

5. In another terminal, start the frontend.

```bash
cd client
npm run dev
```

6. Open http://localhost:5173.

## Render configuration

### Server Web Service

```text
Root Directory: server
Build Command: npm install
Start Command: npm start
Health Check: /api/health
```

Required environment variables include `DATABASE_URL`, `JWT_SECRET`,
`CLIENT_URL`, `NODE_ENV=production`, and the administrator seed values when
running the reset command intentionally.

### Client Static Site

```text
Root Directory: client
Build Command: npm install && npm run build
Publish Directory: dist
VITE_API_URL=https://momentum-bxgh.onrender.com
```

React Router rewrite:

```text
/*  ->  /index.html  (Rewrite)
```

## Final walkthrough



https://www.loom.com/share/d0b4bcf7e0a140a08fa024e510270d64




