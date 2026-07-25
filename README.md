# Momentum

CodePath WEB103 Final Project

Designed and developed by: Kritazya Upreti, Johan Almanzar, Ngoc (Vy) Pham, Joy Tran

🔗 Link to deployed app:

---

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

# Tech Stack

Frontend:
- React
- React Router
- Tailwind CSS

Backend:
- Node.js
- Express
- PostgreSQL

---

# Features

## ✅ Personalized Onboarding

New users complete a short onboarding questionnaire that collects their fitness goal, experience level, preferred workout location, available equipment, and desired workout frequency. This information is used to automatically generate a personalized starter workout plan.

https://github.com/user-attachments/assets/35ec711a-0d21-4578-8e35-a6a9aca0beed



---

## Daily Workout Generator

Each day, users receive a personalized workout generated from the exercise database using their preferences and workout history. The app removes the need to manually plan workouts, helping users stay focused on consistency rather than deciding what to do.

[gif goes here]

---

## Workout Progress Dashboard

The home dashboard displays workout streaks, weekly progress, completed workouts, achievement milestones, and personalized motivational messages based on each user's fitness journey.

[gif goes here]

---

## Workout History Management

Users can view, update, and remove completed workout logs, allowing them to maintain an accurate record of their fitness progress.

[gif goes here]

---

## Accountability Groups

Users can create or join small accountability groups where members encourage one another by sharing workout completion status and streak progress. The app focuses on accountability rather than creating a full social media experience.

[gif goes here]

---

## Exercise Library

Users can browse a searchable exercise database containing exercise descriptions, target muscle groups, difficulty levels, and equipment requirements.

[gif goes here]

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

1. Clone the repository.

```bash
git clone <repository-url>
```

2. Install frontend dependencies.

```bash
cd client
npm install
```

3. Install backend dependencies.

```bash
cd ../server
npm install
```

4. Configure environment variables.

Create a `.env` file containing your PostgreSQL database connection string.

```env
DATABASE_URL=your_database_connection_string
```

5. Seed the database.

```bash
npm run seed
```

6. Start the backend server.

```bash
npm run dev
```

7. Start the frontend.

```bash
cd ../client
npm run dev
```

8. Open the application in your browser.

```
http://localhost:5173
```
