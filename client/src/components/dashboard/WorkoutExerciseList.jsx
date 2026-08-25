// A single exercise preview row: seen as exerices todo
function ExerciseRow({ index, name, scheme, completed }) {
  return (
    <li
      className={`flex items-center gap-2 sm:gap-3 rounded-2xl border px-2 py-1.5 sm:px-4 sm:py-3.5 transition ${
        completed
          ? "border-momentum-border/30 bg-white/2 opacity-50"
          : "border-momentum-border/60 bg-white/2"
      }`}
    >
      <span
        className={`font-mono text-[10px] sm:text-xs font-bold ${
          completed ? "text-momentum-muted" : "text-momentum-lime"
        }`}
      >
        {String(index).padStart(2, "0")}
      </span>
      <span
        className={`font-bold ${
          completed
            ? "text-momentum-muted line-through"
            : "text-white text-[15px]"
        }`}
      >
        {name}
      </span>
      <span className="ml-auto font-mono text-sm text-momentum-muted">
        {scheme}
      </span>
    </li>
  );
}

// Generated WorkoutLists Holder
export default function WorkoutExerciseList({ exercises }) {
  return (
    <ol className="grid grid-cols-1 gap-3 md:grid-cols-2">
      {exercises.map((exercise, i) => (
        <ExerciseRow
          key={exercise.templateExerciseId}
          index={i + 1}
          name={exercise.name}
          scheme={exercise.scheme}
          completed={exercise.completed}
        />
      ))}
    </ol>
  );
}
