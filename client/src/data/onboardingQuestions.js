export const onboardingQuestions = [
  {
    id: "fitnessGoal",
    title: "What's your primary fitness goal?",
    description:
      "We'll tailor your workouts around what matters most to you.",
    selectionType: "single",
    options: [
      { label: "Build Muscle", value: "build_muscle" },
      { label: "Lose Weight", value: "lose_weight" },
      { label: "Improve Endurance", value: "improve_endurance" },
      { label: "Stay Active & Healthy", value: "stay_active" },
    ],
  },
  {
    id: "experienceLevel",
    title: "How would you describe your experience?",
    description: "No judgment — we want to find the right starting point.",
    selectionType: "single",
    options: [
      { label: "Complete Beginner", value: "beginner" },
      { label: "Some Experience", value: "some_experience" },
      { label: "Intermediate", value: "intermediate" },
      { label: "Advanced", value: "advanced" },
    ],
  },
  {
    id: "preferredLocation",
    title: "Where do you prefer to work out?",
    description: "We'll recommend exercises that fit your environment.",
    selectionType: "single",
    options: [
      { label: "At Home", value: "home" },
      { label: "At the Gym", value: "gym" },
      { label: "Outdoors", value: "outdoors" },
      { label: "Mixed / Flexible", value: "mixed" },
    ],
  },
  {
    id: "equipmentAvailable",
    title: "What equipment do you have?",
    description: "Select all that apply to your setup.",
    selectionType: "multiple",
    options: [
      { label: "No Equipment", value: "none" },
      { label: "Dumbbells", value: "dumbbells" },
      { label: "Resistance Bands", value: "resistance_bands" },
      { label: "Full Gym Access", value: "full_gym" },
    ],
  },
  {
    id: "weeklyCommitment",
    title: "How many days per week can you commit?",
    description: "Consistency beats intensity. Pick what's realistic.",
    selectionType: "single",
    options: [
      { label: "2 days", value: 2 },
      { label: "3 days", value: 3 },
      { label: "4 days", value: 4 },
      { label: "5+ days", value: 5 },
    ],
  },
];
