import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { CardShell } from "../components/dashboard/CardShell";
import { useNavigate } from "react-router-dom";
import { toTodayWorkout } from "../components/dashboard/TodaysWorkoutCard";
import { getUserWorkout, updateExerciseCompletion } from "../api/usersApi";
import { CurrentExerciseCard } from "../components/activeWorkout/CurrentExerciseCard";
import { CurrentExerciseHeader } from "../components/activeWorkout/CurrentExerciseHeader";
import { useAuth } from "../context/authContext";

function CompletedList({ exercises }) {
  if (exercises.length === 0) return null;

  return (
    <section className="mt-8">
      <p className="text-xs font-semibold uppercase tracking-[0.15em] text-momentum-muted">
        Completed
      </p>
      <ol className="mt-3 space-y-2">
        {exercises.map((exercise) => (
          <li
            key={exercise.templateExerciseId}
            className="flex items-center gap-4 rounded-2xl border border-momentum-border/40 bg-white/2 px-4 py-3 text-momentum-muted opacity-60"
          >
            <Check
              className="h-4 w-4 shrink-0 text-momentum-lime"
              aria-hidden="true"
            />
            <span className="font-medium line-through">{exercise.name}</span>
            <span className="ml-auto font-mono text-sm">
              {exercise.sets} × {exercise.reps}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default function ActiveWorkout() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [workout, setWorkout] = useState(null);
  const [exerciseQueue, setExerciseQueue] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadTodaysWorkout() {
      try {
        const data = await getUserWorkout();
        if (!active) return;
        const today = toTodayWorkout(data);
        setWorkout(today);
        setExerciseQueue(today.exercises ?? []);
        const nextIndex = (today.exercises ?? []).findIndex(
          (exercise) => !exercise.completed,
        );
        setCurrentIndex(nextIndex === -1 ? 0 : nextIndex);
        setStatus("ready");
      } catch (err) {
        if (!active) return;
        setError(err.message);
        setStatus("error");
      }
    }

    loadTodaysWorkout();
    return () => {
      active = false;
    };
  }, []);

  const handleExerciseComplete = async (templateExerciseId) => {
    try {
      const result = await updateExerciseCompletion(templateExerciseId, {
        completed: true,
      });

      setExerciseQueue((prevExercises) => {
        const updatedExercises = prevExercises.map((exercise) =>
          exercise.templateExerciseId === templateExerciseId
            ? { ...exercise, completed: true }
            : exercise,
        );

        const nextIndex = updatedExercises.findIndex(
          (exercise, index) => index > currentIndex && !exercise.completed,
        );
        if (nextIndex !== -1) {
          setCurrentIndex(nextIndex);
        } else {
          const firstRemaining = updatedExercises.findIndex(
            (exercise) => !exercise.completed,
          );
          setCurrentIndex(
            firstRemaining === -1 ? updatedExercises.length : firstRemaining,
          );
        }

        return updatedExercises;
      });

      setWorkout((prevWorkout) =>
        prevWorkout
          ? { ...prevWorkout, completed: result.sessionCompleted }
          : prevWorkout,
      );

      // The session finishing may have bumped the user's streak — refresh
      // the shared auth user so the header/sidebar streak counts update.
      if (result.sessionCompleted) {
        refresh();
      }
    } catch (err) {
      setError(err.message);
    }
  };

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

  const {
    label,
    title,
    difficulty,
    durationMin,
    calories,
    targetMuscles,
    started,
    completed,
  } = workout;

  const currExercise = exerciseQueue[currentIndex] ?? null;
  const upNextExercises = exerciseQueue.filter(
    (exercise, index) => index !== currentIndex && !exercise.completed,
  );
  const completedExercises = exerciseQueue.filter(
    (exercise) => exercise.completed,
  );
  const allExercisesCompleted =
    exerciseQueue.length > 0 &&
    completedExercises.length === exerciseQueue.length;

  // currExercise is only null once every exercise has been completed
  // (see handleExerciseComplete, which advances currentIndex past the end).
  if (!currExercise) {
    return (
      <div className="min-h-screen bg-momentum-bg text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-6">
          <CurrentExerciseHeader
            completed={completed}
            started={started}
            title={title}
            onExit={() => navigate("/dashboard")}
          />

          <section className="mt-8 rounded-3xl border border-momentum-border bg-momentum-panel p-8 text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-momentum-lime">
              Workout Complete
            </p>
            <h2 className="mt-2 font-display text-3xl text-white">
              All exercises done
            </h2>
            <p className="mt-2 text-sm text-momentum-muted">
              Great work — head back to your dashboard.
            </p>
          </section>

          <CompletedList exercises={completedExercises} />

          <footer className="mt-auto pt-8">
            <button
              type="button"
              className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-momentum-lime px-6 py-3 font-black text-momentum-bg transition-colors hover:bg-[#d2ff52]"
              onClick={() => navigate("/dashboard")}
            >
              Finish
              <Check className="h-4 w-4" aria-hidden="true" />
            </button>
          </footer>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-momentum-bg text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-6 py-6">
        {/* Header */}
        <CurrentExerciseHeader
          completed={completed}
          started={started}
          title={title}
          onExit={() => navigate("/dashboard")}
        />
        {/* ── Overall progress bar ───────────────────────────────────────── */}
        <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/5">
          {/* TODO: width bound to completion % */}
          <div className="h-full w-1/5 rounded-full bg-momentum-lime" />
        </div>

        <CurrentExerciseCard
          key={currExercise.templateExerciseId}
          exerciseName={currExercise.name}
          targetMuscle={currExercise.target_muscle}
          sets={currExercise.sets}
          reps={currExercise.reps}
          onComplete={() =>
            handleExerciseComplete(currExercise.templateExerciseId)
          }
        />

        {/* ── Up next (rest of the workout) ──────────────────────────────── */}
        <section className="mt-8">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-momentum-muted">
            Up Next
          </p>
          <ol className="mt-3 space-y-2">
            {upNextExercises.map((exercise, index) => (
              <li
                key={exercise.templateExerciseId}
                className="flex items-center gap-4 rounded-2xl border border-momentum-border/60 px-4 py-3 text-momentum-muted"
              >
                <span className="font-mono text-xs text-momentum-lime">
                  {String(index + 2).padStart(2, "0")}
                </span>
                <span className="font-medium">{exercise.name}</span>
                <span className="ml-auto font-mono text-sm">
                  {exercise.sets} × {exercise.reps}
                </span>
              </li>
            ))}
          </ol>
        </section>

        <CompletedList exercises={completedExercises} />

        {/* ── Bottom controls ────────────────────────────────────────────── */}
        {(() => {
          const previousIndex = exerciseQueue
            .slice(0, currentIndex)
            .map((_, index) => index)
            .reverse()
            .find((index) => !exerciseQueue[index].completed);
          const nextIndex = exerciseQueue.findIndex(
            (exercise, index) => index > currentIndex && !exercise.completed,
          );

          return (
            <footer className="mt-auto flex items-center gap-3 pt-8">
              <button
                type="button"
                disabled={previousIndex === undefined}
                className="inline-flex items-center gap-2 rounded-2xl border border-momentum-border px-5 py-3 font-semibold text-white transition-colors hover:bg-momentum-panel disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setCurrentIndex(previousIndex)}
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                Previous
              </button>

              <button
                type="button"
                disabled={nextIndex === -1}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-2xl border border-momentum-border px-5 py-3 font-semibold text-white transition-colors hover:bg-momentum-panel disabled:cursor-not-allowed disabled:opacity-50"
                onClick={() => setCurrentIndex(nextIndex)}
              >
                Next
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                disabled={!allExercisesCompleted}
                title={
                  allExercisesCompleted
                    ? undefined
                    : "Complete every exercise to finish"
                }
                className="inline-flex items-center gap-2 rounded-2xl bg-momentum-lime px-6 py-3 font-black text-momentum-bg transition-colors hover:bg-[#d2ff52] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-momentum-lime"
                onClick={() => navigate("/dashboard")}
              >
                Finish
                <Check className="h-4 w-4" aria-hidden="true" />
              </button>
            </footer>
          );
        })()}
      </div>
    </div>
  );
}
