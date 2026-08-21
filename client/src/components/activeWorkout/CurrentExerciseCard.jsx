import { Clock, Target } from "lucide-react";
import { PerSet } from "./PerSet";

export function CurrentExerciseCard({
  exerciseName,
  targetMuscle,
  sets,
  reps,
  onComplete,
}) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-momentum-border bg-momentum-panel p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 -top-20 h-56 w-56 rounded-full bg-[#273410] blur-3xl"
      />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-momentum-muted">
            Current Exercise
          </p>
          <h2 className="mt-1 font-display text-3xl text-white">
            {exerciseName}
          </h2>

          <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-momentum-muted">
            <span className="flex items-center gap-1.5">
              <Target className="h-4 w-4" aria-hidden="true" />
              {targetMuscle}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" aria-hidden="true" />
              Rest 60s{/* Static- for now */}
            </span>
          </div>
        </div>

        <span className="shrink-0 rounded-full border border-momentum-border px-4 py-2 font-mono text-sm text-momentum-lime">
          {sets} x {reps}
        </span>
      </div>

      <div className="relative">
        <PerSet sets={sets} reps={reps} onComplete={onComplete} />
      </div>
    </section>
  );
}
