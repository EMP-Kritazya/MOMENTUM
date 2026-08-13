const upperPlan = [
  { exerciseName: "Bodyweight Push-Up", sets: 3, reps: 10 },
  { exerciseName: "Chin-Up", sets: 3, reps: 10 },
  { exerciseName: "Handstand Push-Ups", sets: 3, reps: 10 },
  { exerciseName: "Dips - Triceps Version", sets: 3, reps: 10 },
];

const lowerPlan = [
  { exerciseName: "Bodyweight Squat", sets: 3, reps: 12 },
  { exerciseName: "Barbell Deadlift", sets: 3, reps: 8 },
  { exerciseName: "Ball Leg Curl", sets: 3, reps: 12 },
  { exerciseName: "Crunches", sets: 3, reps: 15 },
];

const fullPlan = [
  { exerciseName: "Bodyweight Squat", sets: 3, reps: 12 },
  { exerciseName: "Bodyweight Push-Up", sets: 3, reps: 10 },
  { exerciseName: "Bent Over Barbell Row", sets: 3, reps: 10 },
  { exerciseName: "Crunches", sets: 3, reps: 15 },
];

export const demoUsers = [
  {
    username: "jordan_demo",
    firstName: "Jordan",
    lastName: "Davis",
    email: "jordan.demo@momentum.local",
    fitnessGoal: "stay_active",
    experienceLevel: "beginner",
    equipmentAvailable: "{none,dumbbells,full_gym}",
    weeklyCommitment: 4,
    currentStreak: 12,
  },
  {
    username: "alex_demo",
    firstName: "Alex",
    lastName: "Rivera",
    email: "alex.demo@momentum.local",
    fitnessGoal: "build_muscle",
    experienceLevel: "intermediate",
    equipmentAvailable: "{full_gym}",
    weeklyCommitment: 5,
    currentStreak: 9,
  },
  {
    username: "sam_demo",
    firstName: "Sam",
    lastName: "Kim",
    email: "sam.demo@momentum.local",
    fitnessGoal: "improve_endurance",
    experienceLevel: "some_experience",
    equipmentAvailable: "{none,dumbbells}",
    weeklyCommitment: 4,
    currentStreak: 7,
  },
  {
    username: "chris_demo",
    firstName: "Chris",
    lastName: "Lee",
    email: "chris.demo@momentum.local",
    fitnessGoal: "lose_weight",
    experienceLevel: "beginner",
    equipmentAvailable: "{none}",
    weeklyCommitment: 3,
    currentStreak: 6,
  },
  {
    username: "taylor_demo",
    firstName: "Taylor",
    lastName: "Brooks",
    email: "taylor.demo@momentum.local",
    fitnessGoal: "stay_active",
    experienceLevel: "advanced",
    equipmentAvailable: "{full_gym}",
    weeklyCommitment: 5,
    currentStreak: 10,
  },
  {
    username: "morgan_demo",
    firstName: "Morgan",
    lastName: "Chen",
    email: "morgan.demo@momentum.local",
    fitnessGoal: "build_muscle",
    experienceLevel: "intermediate",
    equipmentAvailable: "{dumbbells,full_gym}",
    weeklyCommitment: 4,
    currentStreak: 8,
  },
];

export const demoGroup = {
  groupName: "Morning Warriors",
  description: "Morning workout friends",
  inviteCode: "MOMENTUM26",
  creatorUsername: "jordan_demo",
  currentStreak: 12,
  memberUsernames: demoUsers.map((user) => user.username),
};

const plans = [
  {
    templateTitle: "Beginner Upper Body",
    exercises: upperPlan,
  },
  {
    templateTitle: "Beginner Lower Body",
    exercises: lowerPlan,
  },
  {
    templateTitle: "Beginner Full Body",
    exercises: fullPlan,
  },
];

const peerUsernames = [
  "alex_demo",
  "sam_demo",
  "chris_demo",
  "taylor_demo",
  "morgan_demo",
];

// Five peers are complete today. Jordan stays pending so the demo can show
// the group changing from 5/6 to 6/6 after completing today's workout.
const todayPeerSessions = peerUsernames.map((username, index) => ({
  username,
  ...plans[index % plans.length],
  daysAgo: 0,
  durationMinutes: 30 + index * 5,
  started: true,
  completed: true,
}));

const jordanTodaySession = {
  username: "jordan_demo",
  ...plans[0],
  daysAgo: 0,
  durationMinutes: 0,
  started: false,
  completed: false,
};

// Twelve previous days populate Jordan's History and activity dashboard.
const jordanHistory = Array.from({ length: 12 }, (_, index) => ({
  username: "jordan_demo",
  ...plans[index % plans.length],
  daysAgo: index + 1,
  durationMinutes: 30 + (index % 4) * 5,
  started: true,
  completed: true,
}));

export const demoSessions = [
  jordanTodaySession,
  ...todayPeerSessions,
  ...jordanHistory,
];
