import { AlternatingExerciseImage } from "../utilities/AlternatingExerciseImage";

// Sits beside the current exercise on large screens (sticky, so it stays in
// view while the workout list scrolls) and stacks below it on mobile.
export function ExerciseMediaPanel({ exerciseName, imageUrls, instructions }) {
  const hasMedia = imageUrls?.length > 0;
  const hasInstructions = instructions?.length > 0;

  if (!hasMedia && !hasInstructions) return null;

  return (
    <aside className="relative overflow-hidden rounded-3xl border border-momentum-border bg-momentum-panel p-4 sm:p-5 lg:sticky lg:top-6 lg:self-start">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#273410] blur-3xl"
      />

      <div className="relative">
        {hasMedia ? (
          <AlternatingExerciseImage
            imageUrls={imageUrls}
            alt={exerciseName}
            className="w-full rounded-2xl"
          />
        ) : (
          <div className="flex aspect-[3/2] w-full items-center justify-center rounded-2xl border border-dashed border-momentum-border/60 text-sm text-momentum-muted">
            No preview available
          </div>
        )}

        {hasInstructions && (
          <div className="mt-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-momentum-lime">
              How to perform this exercise
            </p>
            <ol className="mt-3 space-y-2 text-sm text-momentum-muted list-decimal list-inside">
              {instructions.map((step, index) => (
                <li key={index}>{step}</li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </aside>
  );
}
