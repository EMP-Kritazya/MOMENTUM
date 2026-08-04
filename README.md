# Momentum

CodePath WEB103 Final Project

Designed and developed by Kritazya Upreti, Johan Almanzar, Ngoc (Vy) Pham,
and Joy Tran.

- Deployed site: https://momentum-z1ob.onrender.com/

## About

Momentum is a full-stack fitness consistency platform designed to help
beginners and casual gym-goers build sustainable workout habits. It combines
guided onboarding, workout tracking, and small accountability groups so users
can focus on consistency instead of planning every detail themselves.

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

### ✅ Accountability groups

Authenticated members can create a group, receive an invite code, join another
group, see member streak and daily-completion information, and leave a group.
Group administrators can update or delete only groups they administer.

<!-- TODO: Replace this comment with the uploaded Accountability Groups GIF. -->

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




