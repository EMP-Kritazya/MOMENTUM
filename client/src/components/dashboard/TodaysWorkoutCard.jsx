import {
  AlertTriangle,
  ArrowRight,
  Clock,
  Zap,
  Target,
  Waves,
} from "lucide-react";
import WorkoutExerciseList from "./WorkoutExerciseList";
import { getUserWorkout, getActivitySummary } from "../../api/usersApi";
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { CardShell } from "./CardShell";
import { updateSession } from "../../api/usersApi";
import { toTodayWorkout } from "../../utils/toTodayWorkout";

function msUntilNextLocalMidnight() {
  const now = new Date();
  const nextLocalMidnight = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate() + 1,
  );
  return nextLocalMidnight.getTime() - now.getTime();
}

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
  const [weekly, setWeekly] = useState(null);
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
        const [data, summary] = await Promise.all([
          getUserWorkout(),
          getActivitySummary(),
        ]);
        if (!active) return;
        setWorkout(toTodayWorkout(data));
        setWeekly(summary.weekly);
        setStatus("ready");
      } catch (err) {
        if (!active) return;
        setError(err.message);
        setStatus("error");
      }
    }

    loadWorkout();

    const timeoutId = setTimeout(() => {
      loadWorkout();
    }, msUntilNextLocalMidnight());

    return () => {
      active = false;
      clearTimeout(timeoutId);
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
    rolledOver,
  } = workout;

  async function handleStart() {
    if (!started) {
      started = true;
    }

    await handleUpdateSession(started, completed);
    navigate("/workout/active");
  }

  const streakWarning =
    weekly?.atRisk && !completed && !weekly?.onboardingWeek
      ? weekly.inGraceWeek
        ? "This is your grace week — you will lose your streak if you don't fulfill your commitment."
        : "Finish today's workout or you'll miss this week's goal and enter a grace week."
      : null;

  const onboardingInfo = weekly?.onboardingWeek
    ? "Onboarding Week: This is the only week with no limitation on how much you can increase your streak. You don't lose your streak."
    : null;

  return (
    <CardShell>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 -top-24 h-82 w-92 rounded-full bg-[#273410] blur-3xl"
      />

      <div className="relative">
        {(rolledOver || streakWarning || onboardingInfo) && (
          <div className="mb-6 flex flex-col gap-2">
            {!onboardingInfo && rolledOver && (
              <div className="flex items-center gap-2 rounded-2xl border border-momentum-border/60 bg-white/5 px-4 py-2.5 text-sm text-momentum-muted">
                <AlertTriangle
                  className="h-4 w-4 shrink-0 text-momentum-muted"
                  aria-hidden="true"
                />
                Pervious workout wasn&apos;t finished, thus has been rolled
                over.
              </div>
            )}
            {!onboardingInfo && streakWarning && (
              <div
                className={`flex items-center gap-2 rounded-2xl border px-4 py-2.5 text-sm font-semibold ${
                  weekly.inGraceWeek
                    ? "border-red-500/40 bg-red-500/10 text-red-400"
                    : "border-amber-500/40 bg-amber-500/10 text-amber-400"
                }`}
              >
                <AlertTriangle
                  className="h-4 w-4 shrink-0"
                  aria-hidden="true"
                />
                {streakWarning}
              </div>
            )}
            {onboardingInfo && (
              <div className="flex items-center gap-2 rounded-2xl border border-momentum-border/60 bg-white/5 px-4 py-2.5 text-sm text-blue-200">
                <Waves
                  className="h-4 w-4 shrink-0 text-blue-200"
                  aria-hidden="true"
                />
                {onboardingInfo}
              </div>
            )}
          </div>
        )}

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
                : started
                  ? "Continue your workout"
                  : undefined
            }
            className="inline-flex shrink-0 items-center gap-2 rounded-2xl bg-momentum-lime px-8 py-2.5 mt-7 font-black text-momentum-bg transition-colors hover:bg-[#d2ff52] focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime focus-visible:ring-offset-2 focus-visible:ring-offset-momentum-panel cursor-pointer disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-momentum-lime"
          >
            {completed
              ? "Today's Workout - Completed"
              : started
                ? "Continue Workout"
                : "Start Workout"}
            {!completed && (
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        <div className="mt-8">
          <WorkoutExerciseList exercises={exercises} />
        </div>
      </div>
    </CardShell>
  );
}
