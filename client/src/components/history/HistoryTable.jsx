import { MoreHorizontal } from "lucide-react";
import StatusBadge from "./StatusBadge";

function formatWorkoutDate(date) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(`${date.slice(0, 10)}T00:00:00`));
}

export default function HistoryTable({ workouts, onOpenWorkout }) {
  return (
    <div className="hidden overflow-hidden rounded-2xl border border-momentum-border bg-momentum-panel md:block">
      <table className="w-full border-collapse text-left">
        <thead className="border-b border-momentum-border text-xs uppercase tracking-wider text-momentum-muted">
          <tr>
            <th scope="col" className="px-5 py-4 font-medium">Workout</th>
            <th scope="col" className="px-5 py-4 font-medium">Date</th>
            <th scope="col" className="px-5 py-4 font-medium">Duration</th>
            <th scope="col" className="px-5 py-4 font-medium">Status</th>
            <th scope="col" className="w-14 px-5 py-4">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>

        <tbody className="divide-y divide-momentum-border">
          {workouts.map((workout) => (
            <tr key={workout.session_id} className="transition-colors hover:bg-white/[0.02]">
              <td className="px-5 py-4">
                <p className="font-semibold text-white">{workout.title}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {workout.muscle_groups.map((muscle) => (
                    <span
                      key={muscle}
                      className="rounded-full bg-[#1c1f2f] px-2 py-0.5 text-xs text-momentum-muted"
                    >
                      {muscle}
                    </span>
                  ))}
                </div>
              </td>
              <td className="px-5 py-4 text-sm text-momentum-muted">
                {formatWorkoutDate(workout.date)}
              </td>
              <td className="px-5 py-4 text-sm text-momentum-muted">
                {workout.duration_minutes}m
              </td>
              <td className="px-5 py-4">
                <StatusBadge status={workout.status} />
              </td>
              <td className="px-5 py-4">
                <button
                  type="button"
                  onClick={() => onOpenWorkout(workout)}
                  aria-label={`View ${workout.title} details`}
                  className="rounded-lg p-2 text-momentum-muted hover:bg-white/5 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime"
                >
                  <MoreHorizontal size={18} aria-hidden="true" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}