// Placeholder data for the fitness dashboard UI.
// Replace these objects with real API responses when wiring up the backend.

export const user = {
  name: "Jordan",
  streakDays: 12,
};

export const todayWorkout = {
  label: "Today's Workout",
  title: "Upper Body Strength",
  difficulty: "Beginner",
  durationMin: 45,
  calories: 220,
  targetMuscles: ["Chest", "Back", "Shoulders", "Arms"],
  exercises: [
    { id: 1, name: "Push-ups", scheme: "3 × 12–15" },
    { id: 2, name: "Dumbbell Rows", scheme: "3 × 10–12" },
    { id: 3, name: "Shoulder Press", scheme: "3 × 10" },
    { id: 4, name: "Tricep Dips", scheme: "3 × 12" },
    { id: 5, name: "Bicep Curls", scheme: "3 × 12" },
  ],
};

export const progressInsight = {
  headline: "You've completed 47 workouts. That's more than you had last month 🔥",
  subline: "You're in the top 20% of users who reach week 6. Keep the streak alive.",
  deltaPercent: 12,
  deltaLabel: "vs. last month",
};

// Monthly activity grid — columns are weeks (Mon → Sun), each cell is a
// completed (true) / rest (false) day, GitHub-contribution style.
export const monthlyActivity = {
  totalWorkouts: 18,
  weekdayLabels: ["M", "T", "W", "T", "F", "S", "S"],
  // 5 rows (weeks) × 7 columns (days)
  grid: [
    [false, true, true, true, true, false, false],
    [true, true, false, true, true, false, false],
    [true, false, true, true, false, true, false],
    [true, true, false, false, true, false, false],
    [true, true, false, true, false, false, false],
  ],
};

export const weeklyProgress = {
  title: "This Week's Progress",
  subtitle: "Last 8 weeks",
  // Relative bar heights (0–1) for the mini chart.
  bars: [
    { label: "W1", value: 0.45 },
    { label: "W2", value: 0.5 },
    { label: "W3", value: 0.4 },
    { label: "W4", value: 0.72 },
    { label: "W5", value: 0.6 },
    { label: "W6", value: 0.68 },
    { label: "W7", value: 0.85 },
    { label: "W8", value: 0.7 },
  ],
  workoutsCompleted: 4,
  workoutsGoal: 5,
  activeMinutes: 185,
  weeklyGoalPercent: 80,
};

export const groupProgress = {
  name: "Morning Warriors",
  completedToday: 5,
  totalMembers: 6,
  streakDays: 12,
  members: [
    { id: 1, name: "Alex R.", initial: "A", status: "done" },
    { id: 2, name: "Jordan M.", initial: "J", status: "done" },
    { id: 3, name: "Sam K.", initial: "S", status: "pending" },
    { id: 4, name: "Chris L.", initial: "C", status: "done" },
    { id: 5, name: "Taylor B.", initial: "T", status: "done" },
    { id: 6, name: "You", initial: "Y", status: "done", isCurrentUser: true },
  ],
};

export const todayDate = "Friday, July 11, 2026";
