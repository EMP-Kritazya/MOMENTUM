import { Flame } from "lucide-react";

// Current Streak + Flame Icon
export default function StreakBadge({ days }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-momentum-border bg-momentum-panel md:px-4 md:py-2 px-2 py-1 animate-[streakGlow_2s_ease-in-out_infinite]">
      <Flame className="h-4 w-4 text-momentum-lime" aria-hidden="true" />
      <span className="text-[15px] sm:text-[18px] font-bold text-momentum-lime">
        {days}
      </span>
      <span className="text-[15px] sm:text-[18px] text-momentum-muted">
        days streak
      </span>
    </div>
  );
}
