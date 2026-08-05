import { ArrowRight, Clock, Zap, Target } from "lucide-react";
import WorkoutExerciseList from "./WorkoutExerciseList";
import { getUserWorkout } from "../../api/usersApi";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CardShell } from "./CardShell";
import { updateSession } from "../../api/usersApi";
import { toTodayWorkout } from "../../utils/toTodayWorkout";

function MetaStat({ icon: Icon, children }) {
  return (
    <span className="flex items-center gap-1.5 text-sm text-momentum-muted">
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </span>
  );
}

// Generated WorkoutPlan Card Component
export function TodaysWorkoutCard() {
  const navigate = useNavigate();
  const [workout, setWorkout] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [error, setError] = useState("");

  const handleUpdateSession = useCallback(async (started, completed) => {
    const payload = {
      started: started,
      completed: completed,
    };
    await updateSession(payload);
  }, []);

  useEffect(() => {
    let active = true;

    async function loadWorkout() {
      try {
        const data = await getUserWorkout();
        if (!active) return;
        setWorkout(toTodayWorkout(data));
        setStatus("ready");
      } catch (err) {
        if (!active) return;
        setError(err.message);
        setStatus("error");
      }
    }

    loadWorkout();
    return () => {
      active = false;
    };
  }, []);

  if (status === "loading") {
    return (
      <CardShell>
        <div className="h-4 w-32 animate-pulse rounded bg-white/10" />
        <div className="mt-4 h-10 w-64 animate-pulse rounded bg-white/10" />
        <div className="mt-8 grid grid-cols-1 gap-3 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={i}
              className="h-14 animate-pulse rounded-2xl bg-white/5"
            />
          ))}
        </div>
      </CardShell>
    );
  }

  if (status === "error") {
    return (
      <CardShell>
        <p className="text-xs font-semibold uppercase tracking-[0.15em] text-momentum-lime">
          Today&apos;s Workout
        </p>
        <p className="mt-3 text-sm text-red-400">
          Couldn&apos;t load today&apos;s workout: {error}
        </p>
      </CardShell>
    );
  }

  let {
    label,
    title,
    difficulty,
    durationMin,
    calories,
    targetMuscles,
    started,
    completed,
    exercises,
  } = workout;

  async function handleStart() {
    if (!started) {
      started = true;
    }

    await handleUpdateSession(started, completed);
    navigate("/workout/active");
  }

  return (
    <CardShell>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-82 w-92 rounded-full bg-[#273410] blur-3xl"
      />

      <div className="relative">
        <div className="flex items-start justify-between">
          <p className="text-xs font-bold uppercase tracking-[0.15em] text-momentum-lime">
            {label}
          </p>
          <span className="rounded-full border border-[#3B4627] bg-[#273410] px-4 py-2 text-xs font-bold text-momentum-lime">
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
            onClick={handleStart}
            disabled={completed}
            title={
              completed
                ? "You've already finished today's workout — come back tomorrow"
                : undefined
            }
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-momentum-lime px-8 py-2.5 mt-7 font-black text-momentum-bg transition-colors hover:bg-[#d2ff52] focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime focus-visible:ring-offset-2 focus-visible:ring-offset-momentum-panel cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-momentum-lime"
          >
            {completed
              ? "Get Next Workout"
              : started
                ? "Continue Workout"
                : "Start Workout"}

            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>

        <div className="mt-8">
          <WorkoutExerciseList exercises={exercises} />
        </div>
      </div>
    </CardShell>
  );
}
