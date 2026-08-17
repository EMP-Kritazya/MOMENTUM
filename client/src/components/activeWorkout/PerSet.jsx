import { useState, useEffect } from "react";
import { Check } from "lucide-react";

export function PerSet({ sets, reps, onComplete }) {
  const [completedSets, setCompletedSets] = useState(() =>
    Array(sets).fill(false),
  );

  useEffect(() => {
    setCompletedSets(Array(sets).fill(false));
  }, [sets]);

  const setArray = Array.from({ length: sets }, (_, index) => index + 1);

  const handleCheck = (index) => {
    const nextSets = [...completedSets];
    nextSets[index] = !nextSets[index];
    setCompletedSets(nextSets);

    const wasComplete = completedSets.every(Boolean);
    const isComplete = nextSets.every(Boolean);
    if (!wasComplete && isComplete) {
      onComplete();
    }
  };

  return (
    <div className="mt-6 space-y-3">
      {setArray.map((setNumber, index) => {
        const isComplete = completedSets[index];
        return (
          <div
            key={setNumber}
            className={`flex items-center justify-between rounded-2xl border px-4 py-3.5 transition ${
              isComplete
                ? "border-momentum-lime/80 bg-momentum-lime/10"
                : "border-momentum-border/60 bg-white/2"
            }`}
          >
            <span className="text-sm font-medium text-white">
              Set {setNumber}
            </span>
            <span className="font-mono text-sm text-momentum-muted">
              {reps} reps
            </span>
            <button
              type="button"
              onClick={() => handleCheck(index)}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full border text-momentum-muted transition ${
                isComplete
                  ? "border-momentum-lime bg-momentum-lime/10 text-momentum-lime"
                  : "border-momentum-border hover:border-momentum-lime hover:text-momentum-lime"
              }`}
              aria-label={`Mark set ${setNumber} complete`}
            >
              <Check className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        );
      })}
    </div>
  );
}
