import { TrendingUp } from "lucide-react";

export const progressInsight = {
  headline:
    "You've completed 47 workouts. That's more than you had last month 🔥",
  subline:
    "You're in the top 20% of users who reach week 6. Keep the streak alive.",
  deltaPercent: 12,
  deltaLabel: "vs. last month",
};

// Motivational Progress Insight Card
export default function ProgressInsightCard() {
  const { headline, subline, deltaPercent, deltaLabel } = progressInsight;

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-[#3B4627] bg-momentum-panel p-6 sm:flex-row sm:items-center sm:justify-between bg-linear-to-r from-[#273410]/50 to-[#12151E]">
      <div className="flex items-start gap-4">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-momentum-lime/15 text-momentum-lime">
          <TrendingUp className="h-5 w-5" aria-hidden="true" />
        </span>

        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-momentum-lime">
            Your Progress Insight
          </p>
          <p className="mt-1 text-lg font-medium text-white">{headline}</p>
          <p className="mt-1 text-sm text-momentum-muted">{subline}</p>
        </div>
      </div>

      <div className="shrink-0 text-right">
        <p className="font-display text-3xl text-momentum-lime">
          +{deltaPercent}%
        </p>
        <p className="text-xs text-momentum-muted">{deltaLabel}</p>
      </div>
    </section>
  );
}
