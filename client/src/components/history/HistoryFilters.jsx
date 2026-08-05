import { ArrowDownUp, Filter } from "lucide-react";

const tabs = [
  { value: "all", label: "All Workouts" },
  { value: "completed", label: "Completed" },
  { value: "skipped", label: "Skipped" },
];

export default function HistoryFilters({
  filters,
  muscleOptions,
  onStatusChange,
  onMuscleChange,
  onSortChange,
}) {
  return (
    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap gap-2" aria-label="Workout status filters">
        {tabs.map((tab) => {
          const selected = filters.status === tab.value;

          return (
            <button
              key={tab.value}
              type="button"
              aria-pressed={selected}
              onClick={() => onStatusChange(tab.value)}
              className={[
                "min-h-10 rounded-xl px-4 text-sm font-semibold transition-colors",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime",
                selected
                  ? "bg-momentum-lime text-[#11130d]"
                  : "border border-momentum-border bg-momentum-panel text-momentum-muted hover:text-white",
              ].join(" ")}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={onSortChange}
          className="inline-flex min-h-10 items-center gap-2 rounded-xl border border-momentum-border bg-momentum-panel px-3 text-sm text-momentum-muted hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime"
        >
          <ArrowDownUp size={15} aria-hidden="true" />
          {filters.sort === "desc" ? "Newest first" : "Oldest first"}
        </button>

        <label className="relative">
          <span className="sr-only">Filter by muscle</span>
          <Filter
            size={15}
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-momentum-muted"
          />
          <select
            value={filters.muscle}
            onChange={(event) => onMuscleChange(event.target.value)}
            className="min-h-10 appearance-none rounded-xl border border-momentum-border bg-momentum-panel py-2 pl-9 pr-8 text-sm text-momentum-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-momentum-lime"
          >
            <option value="">All muscles</option>
            {muscleOptions.map((muscle) => (
              <option key={muscle} value={muscle}>
                {muscle}
              </option>
            ))}
          </select>
        </label>
      </div>
    </div>
  );
}
