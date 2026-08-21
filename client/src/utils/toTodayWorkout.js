// Converts the workout-session API response into the shape used by workout UI.
function titleCase(value) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function toTodayWorkout({
  experience_level,
  started,
  completed,
  session,
  title,
  exercises,
}) {
  const list = exercises ?? [];

  let name = (title ?? "").trim().split("_");
  name = name.join(" ") || "Today's Workout Title";

  let difficulty = (experience_level ?? "").trim().split("_");
  difficulty = difficulty.join(" ") || "Your Difficulty";

  const totalSets = list.reduce(
    (sum, exercise) => sum + (exercise.sets ?? 0),
    0,
  );
  const durationMin =
    session?.duration_minutes || Math.max(20, Math.round(totalSets * 2.5));
  const calories = Math.round(durationMin * 5);

  const targetMuscles = [
    ...new Set(list.map((exercise) => exercise.target_muscle).filter(Boolean)),
  ].map(titleCase);

  return {
    label: "Today's Workout",
    title: name,
    difficulty: difficulty || "—",
    durationMin,
    calories,
    targetMuscles,
    started,
    startedAt: session?.started_at ?? null,
    completed,
    rolledOver: session?.rolled_over ?? false,
    exercises: list.map((exercise) => ({
      templateExerciseId: exercise.template_exercise_id,
      exerciseId: exercise.exercise_id,
      name: exercise.exercise_name,
      target_muscle: exercise.target_muscle,
      imageUrls: exercise.image_urls ?? [],
      instructions: exercise.instructions ?? [],
      sets: exercise.sets,
      reps: exercise.reps,
      completed: exercise.completed ?? false,
      scheme: `${exercise.sets} × ${exercise.reps}`,
    })),
  };
}
