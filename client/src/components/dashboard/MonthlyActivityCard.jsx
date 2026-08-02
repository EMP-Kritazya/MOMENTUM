import { Activity } from "lucide-react";

export default function MonthlyActivityCard({ activity }) {
  const { totalWorkouts, weekdayLabels, grid } = activity;

  return (
    <section className="flex flex-col rounded-3xl border border-momentum-border bg-momentum-panel p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Monthly Activity</h3>
        <Activity className="h-5 w-5 text-momentum-muted" aria-hidden="true" />
      </div>

      <div className="mt-6">
        <div className="mb-2 grid grid-cols-7 gap-2">
          {weekdayLabels.map((label, i) => (
            <span
              key={i}
              className="text-center text-xs font-medium text-momentum-muted"
            >
              {label}
            </span>
          ))}
        </div>

        <div className="flex flex-col gap-2">
          {grid.map((week, rowIndex) => (
            <div key={rowIndex} className="grid grid-cols-7 gap-2">
              {week.map((completed, colIndex) => (
                <div
                  key={colIndex}
                  title={completed ? "Workout completed" : "Rest day"}
                  className={`aspect-square rounded-lg ${
                    completed ? "bg-momentum-lime" : "bg-white/4"
                  }`}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-momentum-muted">
        <span className="font-semibold text-white">
          {totalWorkouts} workouts
        </span>{" "}
        this month
      </p>
    </section>
  );
}
