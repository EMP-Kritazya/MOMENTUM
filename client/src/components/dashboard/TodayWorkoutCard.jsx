import { ArrowRight, Clock, Zap, Target } from "lucide-react";
import WorkoutExerciseList from "./WorkoutExerciseList";

function MetaStat({ icon: Icon, children }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-momentum-muted">
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </span>
  );
}

// Generated WorkoutPlan Card Component
export default function TodayWorkoutCard({ workout, onStart }) {
  const {
    label,
    title,
    difficulty,
    durationMin,
    calories,
    targetMuscles,
    exercises,
  } = workout;

  return (
    <section className="relative overflow-hidden rounded-3xl border border-[#3B4627] bg-[#12151E] p-6 sm:p-8">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-82 w-92 rounded-full bg-[#273410] blur-3xl"
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-momentum-lime">
            {label}
          </p>
          <span className="rounded-full border border-[#3B4627] bg-[#273410] px-4 py-2 text-xs font-medium text-momentum-lime">
            {difficulty}
          </span>
        </div>

        <div className="mt-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h2 className="font-display text-4xl text-white sm:text-4xl">
              {title}
            </h2>

            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
              <MetaStat icon={Clock}>{durationMin} min</MetaStat>
              <MetaStat icon={Zap}>{calories} cal</MetaStat>
              <MetaStat icon={Target}>{targetMuscles.join(" · ")}</MetaStat>
            </div>
          </div>

          <button
            type="button"
            onClick={onStart}
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-momentum-lime px-8 py-2.5 mt-7 font-black text-momentum-bg transition-colors hover:bg-[#d2ff52] focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime focus-visible:ring-offset-2 focus-visible:ring-offset-momentum-panel cursor-pointer"
          >
            Start Workout
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8">
          <WorkoutExerciseList exercises={exercises} />
        </div>

        <button
          type="button"
          className="mt-6 inline-flex items-center gap-1.5 text-sm text-momentum-muted transition-colors hover:text-white"
        >
          View full details &amp; muscle breakdown
          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
        </button>
      </div>
    </section>
  );
}
