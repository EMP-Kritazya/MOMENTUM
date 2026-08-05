import { useEffect, useState } from "react";
import { Activity } from "lucide-react";
import { getActivitySummary } from "../../api/usersApi";

export default function MonthlyActivityCard() {
  const [monthly, setMonthly] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    getActivitySummary()
      .then((data) => {
        if (!active) return;
        setMonthly(data.monthly);
        setStatus("ready");
      })
      .catch((err) => {
        if (!active) return;
        setError(err.message);
        setStatus("error");
      });

    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <section className="flex flex-col rounded-3xl border border-momentum-border bg-momentum-panel p-6">
        <div className="h-5 w-40 animate-pulse rounded bg-white/10" />
        <div className="mt-8 grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div
              key={i}
              className="aspect-square animate-pulse rounded-lg bg-white/5"
            />
          ))}
        </div>
      </section>
    );
  }

  if (status === "error") {
    return (
      <section className="flex flex-col rounded-3xl border border-momentum-border bg-momentum-panel p-6">
        <h3 className="text-lg font-semibold text-white">Monthly Activity</h3>
        <p className="mt-3 text-sm text-red-400">
          Couldn&apos;t load activity: {error}
        </p>
      </section>
    );
  }

  const { totalWorkouts, weekdayLabels, grid } = monthly;

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
