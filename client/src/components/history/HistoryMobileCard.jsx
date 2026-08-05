import StatusBadge from "./StatusBadge";

function formatWorkoutDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date.slice(0, 10)}T00:00:00`));
}

export default function HistoryMobileCard({ workout, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(workout)}
      className="w-full rounded-2xl border border-momentum-border bg-momentum-panel p-4 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime md:hidden"
    >
      <div className="flex items-start justify-between gap-3">
        <div>
          <h2 className="font-semibold text-white">{workout.title}</h2>
          <p className="mt-1 text-sm text-momentum-muted">
            {formatWorkoutDate(workout.date)} · {workout.duration_minutes}m
          </p>
        </div>
        <StatusBadge status={workout.status} />
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {workout.muscle_groups.map((muscle) => (
          <span
            key={muscle}
            className="rounded-full bg-[#1c1f2f] px-2 py-0.5 text-xs text-momentum-muted"
          >
            {muscle}
          </span>
        ))}
      </div>
    </button>
  );
}
