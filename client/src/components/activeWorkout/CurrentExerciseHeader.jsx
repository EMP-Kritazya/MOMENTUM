import { Clock, X } from "lucide-react";

export function CurrentExerciseHeader({
  completed,
  started,
  title,
  elapsedLabel,
  onExit,
}) {
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

      {elapsedLabel ? (
        <span className="flex items-center gap-1.5 font-mono text-sm font-semibold text-momentum-muted">
          <Clock className="h-4 w-4" aria-hidden="true" />
          {elapsedLabel}
        </span>
      ) : (
        <span className="h-10 w-10" aria-hidden="true" />
      )}
    </header>
  );
}
