// Converts the workout-session API response into the shape used by workout UI.
function titleCase(value) {
  return value
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function toTodayWorkout({
  started,
  completed,
  session,
  title,
  exercises,
}) {
  const list = exercises ?? [];

  const [difficulty = "", ...rest] = (title ?? "").trim().split(" ");
  const name = rest.join(" ") || "Today's Workout";

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
    completed,
    exercises: list.map((exercise) => ({
      templateExerciseId: exercise.template_exercise_id,
      exerciseId: exercise.exercise_id,
      name: exercise.exercise_name,
      target_muscle: exercise.target_muscle,
      sets: exercise.sets,
      reps: exercise.reps,
      completed: exercise.completed ?? false,
      scheme: `${exercise.sets} × ${exercise.reps}`,
    })),
  };
}
