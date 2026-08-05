import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { getWorkoutTemplateDetails } from "../../api/workoutHistory";

export default function WorkoutHistoryModal({ workout, onClose }) {
  const [details, setDetails] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!workout) return undefined;

    const controller = new AbortController();

    getWorkoutTemplateDetails(workout.template_id, controller.signal)
      .then(setDetails)
      .catch((requestError) => {
        if (requestError.name !== "AbortError") {
          setError(requestError.message);
        }
      });

    return () => controller.abort();
  }, [workout]);

  useEffect(() => {
    if (!workout) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [workout, onClose]);

  if (!workout) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-modal-heading"
        className="max-h-[85vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-momentum-border bg-momentum-panel p-6 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-momentum-lime">
              Workout details
            </p>
            <h2
              id="history-modal-heading"
              className="mt-2 font-display text-3xl text-white"
            >
              {workout.title}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close workout details"
            className="rounded-lg p-2 text-momentum-muted hover:bg-white/5 hover:text-white"
          >
            <X size={20} aria-hidden="true" />
          </button>
        </div>

        {error && <p className="mt-6 text-sm text-red-400">{error}</p>}

        {!details && !error && (
          <p className="mt-6 text-sm text-momentum-muted">Loading exercises…</p>
        )}

        {details && (
          <ol className="mt-6 space-y-3">
            {details.exercises.map((exercise) => (
              <li
                key={exercise.exercise_id}
                className="flex items-center justify-between gap-4 rounded-xl border border-momentum-border bg-momentum-bg p-4"
              >
                <div>
                  <p className="font-semibold text-white">
                    {exercise.exercise_name}
                  </p>
                  <p className="mt-1 text-sm text-momentum-muted">
                    {exercise.target_muscle}
                  </p>
                </div>
                <p className="shrink-0 text-sm text-momentum-muted">
                  {exercise.sets} × {exercise.reps}
                </p>
              </li>
            ))}
          </ol>
        )}
      </section>
    </div>
  );
}
