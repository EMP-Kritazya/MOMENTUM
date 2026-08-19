# Momentum

![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-database-4169E1?logo=postgresql&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-build-646CFF?logo=vite&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-styling-06B6D4?logo=tailwindcss&logoColor=white)

Momentum is a full-stack fitness consistency platform designed to help
beginners and casual gym-goers build sustainable workout habits. It combines
guided onboarding, workout tracking, and small accountability groups so users
can focus on consistency instead of planning every detail themselves.

**Live app:** https://momentum-z1ob.onrender.com

Idea by **Kritazya Upreti**. Designed and developed by **Kritazya Upreti**,
**Johan Almanzar**, **Ngoc (Vy) Pham**, and **Joy Tran**.

## Table of contents

- [Overview](#overview)
- [Inspiration](#inspiration)
- [Features](#features)
- [Tech stack](#tech-stack)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment variables](#environment-variables)
  - [Database setup](#database-setup)
  - [Running the app](#running-the-app)
- [Testing](#testing)
- [Available scripts](#available-scripts)

## Overview

The app emphasizes long-term consistency over perfection. Users can track
their progress through workout history, streaks, and personalized
motivational insights while participating in small accountability groups
that encourage members to stay committed without the distractions of a
traditional social media platform.

Our goal is to make working out feel simple, approachable, and rewarding so
that users develop lasting fitness habits.

## Inspiration

Many fitness apps assume users already know how to structure workouts,
understand proper training splits, or stay motivated independently. For
beginners, this often creates analysis paralysis and causes them to lose
consistency before building a routine.

Momentum is inspired by habit-building products such as Duolingo and GitHub
contribution streaks, combined with the simplicity of having a personal
coach who tells you exactly what to do each day. Instead of rewarding users
for lifting the most weight, Momentum celebrates consistency, progress, and
small daily victories.

## Features

- **Guided onboarding** — captures experience level, fitness goal, and
  available equipment to personalize every workout.
- **Auto-generated daily workouts** — rotates through upper/lower/full-body
  splits, filtered by the user's equipment and experience.
- **Streaks & weekly goals** — a forgiving weekly-commitment streak with a
  one-week grace period before a streak resets.
- **Activity summary** — a monthly calendar grid and weekly bar chart of
  completed workouts.
- **Workout history** — filterable by muscle group and completed/skipped
  status.
- **Accountability groups** — small groups with invite codes and per-member
  daily status.
- **Authentication** — email/password sign-up plus GitHub OAuth, backed by
  an httpOnly JWT cookie.
- **Admin panel** — manage exercises and workout templates.

## Tech stack

### Frontend

- React
- React Router
- Tailwind CSS
- Vite
- Vitest + React Testing Library

### Backend

- Node.js
- Express
- PostgreSQL
- JWT authentication in httpOnly cookies
- Passport (GitHub OAuth)
- Vitest

## Project structure

```
MOMENTUM/
├── client/            React + Vite frontend
│   ├── src/
│   │   ├── api/       fetch wrappers for the server API
│   │   ├── components/
│   │   ├── context/    AuthProvider / auth context
│   │   ├── pages/
│   │   └── utils/
│   └── tests/
└── server/            Express + PostgreSQL backend
    ├── config/         DB connection, schema reset, seeding, auth strategy
    ├── controllers/
    ├── middleware/
    ├── routes/
    └── tests/
```

## Getting started

### Prerequisites

- Node.js (v20+ recommended)
- A PostgreSQL database (local or hosted)

### Installation

```bash
git clone <this-repo-url>
cd MOMENTUM

cd server && npm install
cd ../client && npm install
```

### Environment variables

Create `server/.env` (see `server/.env.example` for the full template):

| Variable                                                                               | Description                                                                     |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `DATABASE_URL`                                                                         | Full Postgres connection string. Takes priority over the `PG*` variables below. |
| `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`                               | Individual connection settings, used when `DATABASE_URL` isn't set.             |
| `PGSSL`                                                                                | Set to `true` to connect over SSL (e.g. for a hosted database).                 |
| `CLIENT_URL`                                                                           | The frontend origin, used for CORS.                                             |
| `JWT_SECRET`                                                                           | Secret used to sign the auth cookie's JWT.                                      |
| `GITHUB_CLIENT_ID` / `GITHUB_CLIENT_SECRET`                                            | GitHub OAuth app credentials.                                                   |
| `ADMIN_USERNAME`, `ADMIN_firstname`, `ADMIN_lastname`, `ADMIN_EMAIL`, `ADMIN_PASSWORD` | Seed values for the initial admin account, used by `npm run reset`.             |
| `SEED_DEMO_DATA`                                                                       | Set to `true` to seed demo users/workouts as part of `npm run reset`.           |
| `PORT`                                                                                 | Port the server listens on (defaults to `3001`).                                |

Create `client/.env`:

| Variable       | Description                                            |
| -------------- | ------------------------------------------------------ |
| `VITE_API_URL` | Base URL of the server API, used in production builds. |

### Database setup

With `server/.env` configured, create the schema (and optionally seed an
admin account / demo data):

```bash
cd server
npm run reset
```

### Running the app

```bash
# terminal 1 — server (http://localhost:3001)
cd server && npm run dev

# terminal 2 — client (http://localhost:5173)
cd client && npm run dev
```

## Testing

```bash
cd server && npm test
cd client && npm test
```

## Available scripts

### `server/`

| Script                  | Description                            |
| ----------------------- | -------------------------------------- |
| `npm run dev`           | Start the API with auto-reload.        |
| `npm start`             | Start the API.                         |
| `npm run reset`         | Drop and recreate the database schema. |
| `npm run seed:demo`     | Seed demo users and workout data.      |
| `npm test`              | Run the test suite once.               |
| `npm run test:watch`    | Run tests in watch mode.               |
| `npm run test:coverage` | Run tests with coverage.               |

### `client/`

| Script               | Description                         |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start the Vite dev server.          |
| `npm run build`      | Build for production.               |
| `npm run preview`    | Preview a production build locally. |
| `npm test`           | Run the test suite once.            |
| `npm run test:watch` | Run tests in watch mode.            |
| `npm run lint`       | Lint the frontend source.           |
