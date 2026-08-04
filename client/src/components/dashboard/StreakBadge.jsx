import { Flame } from "lucide-react";

// Current Streak + Flame Icon
export default function StreakBadge({ days }) {
  console.log(days);
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-momentum-border bg-momentum-panel px-4 py-2">
      <Flame className="h-4 w-4 text-momentum-lime" aria-hidden="true" />
      <span className="font-bold text-momentum-lime">{days}</span>
      <span className="text-sm text-momentum-muted">days streak</span>
    </div>
  );
}
