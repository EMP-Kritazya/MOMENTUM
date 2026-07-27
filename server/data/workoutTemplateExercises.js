const workoutTemplateExercises = [
  // Template 1: Beginner Upper Body (compound-focused, moderate volume)
  { template_id: 1, exercise_id: 1, sets: 3, reps: 8, exercise_order: 1 }, // Barbell Bench Press
  { template_id: 1, exercise_id: 13, sets: 3, reps: 8, exercise_order: 2 }, // Bent Over Barbell Row
  { template_id: 1, exercise_id: 51, sets: 3, reps: 10, exercise_order: 3 }, // Alternating Cable Shoulder Press
  { template_id: 1, exercise_id: 62, sets: 3, reps: 12, exercise_order: 4 }, // Bench Dips
  { template_id: 1, exercise_id: 81, sets: 3, reps: 12, exercise_order: 5 }, // Dumbbell Bicep Curl

  // Template 2: Beginner Lower Body
  { template_id: 2, exercise_id: 29, sets: 3, reps: 12, exercise_order: 1 }, // Bodyweight Squat
  { template_id: 2, exercise_id: 41, sets: 3, reps: 8, exercise_order: 2 }, // Clean Deadlift
  { template_id: 2, exercise_id: 30, sets: 3, reps: 12, exercise_order: 3 }, // Dumbbell Lunges
  { template_id: 2, exercise_id: 40, sets: 3, reps: 12, exercise_order: 4 }, // Ball Leg Curl
  { template_id: 2, exercise_id: 90, sets: 3, reps: 15, exercise_order: 5 }, // Crunches

  // Template 3: Beginner Full Body (balanced)
  { template_id: 3, exercise_id: 1, sets: 3, reps: 8, exercise_order: 1 }, // Barbell Bench Press
  { template_id: 3, exercise_id: 13, sets: 3, reps: 8, exercise_order: 2 }, // Bent Over Barbell Row
  { template_id: 3, exercise_id: 29, sets: 3, reps: 12, exercise_order: 3 }, // Bodyweight Squat
  { template_id: 3, exercise_id: 41, sets: 3, reps: 8, exercise_order: 4 }, // Clean Deadlift
  { template_id: 3, exercise_id: 51, sets: 3, reps: 10, exercise_order: 5 }, // Alternating Cable Shoulder Press
  { template_id: 3, exercise_id: 90, sets: 3, reps: 15, exercise_order: 6 }, // Crunches

  // Template 4: Intermediate Upper Body (added isolation, higher volume)
  { template_id: 4, exercise_id: 1, sets: 4, reps: 8, exercise_order: 1 }, // Barbell Bench Press
  { template_id: 4, exercise_id: 13, sets: 4, reps: 8, exercise_order: 2 }, // Bent Over Barbell Row
  { template_id: 4, exercise_id: 49, sets: 3, reps: 10, exercise_order: 3 }, // Arnold Dumbbell Press
  { template_id: 4, exercise_id: 22, sets: 3, reps: 12, exercise_order: 4 }, // Full Range-Of-Motion Lat Pulldown
  { template_id: 4, exercise_id: 3, sets: 3, reps: 12, exercise_order: 5 }, // Dumbbell Flyes
  { template_id: 4, exercise_id: 69, sets: 3, reps: 12, exercise_order: 6 }, // EZ-Bar Skullcrusher
  { template_id: 4, exercise_id: 82, sets: 3, reps: 12, exercise_order: 7 }, // EZ-Bar Curl

  // Template 5: Intermediate Lower Body
  { template_id: 5, exercise_id: 25, sets: 4, reps: 8, exercise_order: 1 }, // Barbell Full Squat
  { template_id: 5, exercise_id: 37, sets: 4, reps: 6, exercise_order: 2 }, // Barbell Deadlift
  { template_id: 5, exercise_id: 26, sets: 3, reps: 10, exercise_order: 3 }, // Barbell Lunge
  { template_id: 5, exercise_id: 44, sets: 3, reps: 12, exercise_order: 4 }, // Glute Ham Raise
  { template_id: 5, exercise_id: 34, sets: 3, reps: 12, exercise_order: 5 }, // Hack Squat
  { template_id: 5, exercise_id: 85, sets: 3, reps: 15, exercise_order: 6 }, // Ab Crunch Machine

  // Template 6: Intermediate Full Body (balanced)
  { template_id: 6, exercise_id: 25, sets: 4, reps: 8, exercise_order: 1 }, // Barbell Full Squat
  { template_id: 6, exercise_id: 1, sets: 4, reps: 8, exercise_order: 2 }, // Barbell Bench Press
  { template_id: 6, exercise_id: 13, sets: 4, reps: 8, exercise_order: 3 }, // Bent Over Barbell Row
  { template_id: 6, exercise_id: 37, sets: 4, reps: 6, exercise_order: 4 }, // Barbell Deadlift
  { template_id: 6, exercise_id: 50, sets: 3, reps: 10, exercise_order: 5 }, // Barbell Shoulder Press
  { template_id: 6, exercise_id: 83, sets: 3, reps: 12, exercise_order: 6 }, // Hammer Curls
  { template_id: 6, exercise_id: 91, sets: 3, reps: 15, exercise_order: 7 }, // Decline Crunch

  // Template 7: Advance Upper Body (high volume, heavy compounds first)
  { template_id: 7, exercise_id: 1, sets: 4, reps: 6, exercise_order: 1 }, // Barbell Bench Press
  { template_id: 7, exercise_id: 13, sets: 4, reps: 6, exercise_order: 2 }, // Bent Over Barbell Row
  { template_id: 7, exercise_id: 50, sets: 4, reps: 8, exercise_order: 3 }, // Barbell Shoulder Press
  { template_id: 7, exercise_id: 4, sets: 3, reps: 12, exercise_order: 4 }, // Cable Crossover
  { template_id: 7, exercise_id: 21, sets: 3, reps: 12, exercise_order: 5 }, // Elevated Cable Rows
  { template_id: 7, exercise_id: 57, sets: 3, reps: 15, exercise_order: 6 }, // Face Pull
  { template_id: 7, exercise_id: 65, sets: 3, reps: 12, exercise_order: 7 }, // Cable Rope Overhead Triceps Extension
  { template_id: 7, exercise_id: 84, sets: 3, reps: 12, exercise_order: 8 }, // High Cable Curls

  // Template 8: Advance Lower Body
  { template_id: 8, exercise_id: 25, sets: 4, reps: 6, exercise_order: 1 }, // Barbell Full Squat
  { template_id: 8, exercise_id: 37, sets: 4, reps: 5, exercise_order: 2 }, // Barbell Deadlift
  { template_id: 8, exercise_id: 26, sets: 4, reps: 8, exercise_order: 3 }, // Barbell Lunge
  { template_id: 8, exercise_id: 45, sets: 3, reps: 10, exercise_order: 4 }, // Good Morning
  { template_id: 8, exercise_id: 27, sets: 3, reps: 10, exercise_order: 5 }, // Barbell Step Ups
  { template_id: 8, exercise_id: 44, sets: 3, reps: 12, exercise_order: 6 }, // Glute Ham Raise
  { template_id: 8, exercise_id: 88, sets: 3, reps: 12, exercise_order: 7 }, // Barbell Ab Rollout
  { template_id: 8, exercise_id: 94, sets: 3, reps: 15, exercise_order: 8 }, // Hanging Leg Raise

  // Template 9: Advance Full Body (balanced, heavy)
  { template_id: 9, exercise_id: 25, sets: 4, reps: 6, exercise_order: 1 }, // Barbell Full Squat
  { template_id: 9, exercise_id: 37, sets: 4, reps: 5, exercise_order: 2 }, // Barbell Deadlift
  { template_id: 9, exercise_id: 1, sets: 4, reps: 6, exercise_order: 3 }, // Barbell Bench Press
  { template_id: 9, exercise_id: 13, sets: 4, reps: 6, exercise_order: 4 }, // Bent Over Barbell Row
  { template_id: 9, exercise_id: 50, sets: 4, reps: 8, exercise_order: 5 }, // Barbell Shoulder Press
  { template_id: 9, exercise_id: 61, sets: 3, reps: 10, exercise_order: 6 }, // Close-Grip Barbell Bench Press
  { template_id: 9, exercise_id: 73, sets: 3, reps: 10, exercise_order: 7 }, // Barbell Curl
  { template_id: 9, exercise_id: 94, sets: 3, reps: 15, exercise_order: 8 }, // Hanging Leg Raise
];

export default workoutTemplateExercises;
