// A single exercise preview row: seen as exerices todo
function ExerciseRow({ index, name, scheme }) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-momentum-border/60 bg-white/2 px-4 py-3.5">
      <span className="font-mono text-xs font-bold text-momentum-lime">
        {String(index).padStart(2, "0")}
      </span>
      <span className="font-bold text-white">{name}</span>
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
          key={exercise.id}
          index={i + 1}
          name={exercise.name}
          scheme={exercise.scheme}
        />
      ))}
    </ol>
  );
}
