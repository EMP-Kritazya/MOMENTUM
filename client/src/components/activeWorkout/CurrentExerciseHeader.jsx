import { X } from "lucide-react";

export function CurrentExerciseHeader({ completed, started, title, onExit }) {
  return (
    <header className="flex items-center justify-between">
      <button
        type="button"
        onClick={onExit}
        className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-momentum-border text-momentum-muted transition-colors hover:text-white"
        aria-label="Exit workout"
      >
        <X className="h-5 w-5" aria-hidden="true" />
      </button>

      <div className="text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-momentum-lime">
          {completed
            ? "Completed Workout"
            : started
              ? "Active Workout"
              : "Today's Workout"}
        </p>

        <h1 className="font-display text-xl text-white">{title}</h1>
      </div>

      {/* TODO: real progress (e.g. exercise index / total)
      <span className="text-sm font-semibold text-momentum-muted">1 / 5</span> */}
    </header>
  );
}
