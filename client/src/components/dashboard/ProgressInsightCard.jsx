import { TrendingUp } from "lucide-react";
import { CardShell } from "./CardShell";
import { useState, useEffect } from "react";
import { getProgressInsight } from "../../api/usersApi";

// export const progressInsight = {
//   headline:
//     "You've completed 47 workouts. That's more than you had last month 🔥",
//   subline:
//     "You're in the top 20% of users who reach week 6. Keep the streak alive.",
//   deltaPercent: 12,
//   deltaLabel: "vs. last month",
// };

// Motivational Progress Insight Card
export default function ProgressInsightCard() {
  // const { headline, subline, deltaPercent, deltaLabel } = progressInsight;

  const [progressInsight, setProgressInsight] = useState(null);
  const [status, setStatus] = useState("loading"); // "loading" | "ready" | "error"
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadInsight() {
      try {
        const data = await getProgressInsight();
        if (!active) return;

        setProgressInsight(data.headline);
        setStatus("ready");
      } catch (err) {
        if (!active) return;
        setError(err.message);
        setStatus("error");
      }
    }

    loadInsight();
    return () => {
      active = false;
    };
  }, []);

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
          Your Progress Insight
        </p>
        <p className="mt-3 text-sm text-red-400">
          Couldn&apos;t load today&apos;s insight: {error}
        </p>
      </CardShell>
    );
  }

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
          <p className="mt-1 text-lg font-medium text-white">
            {progressInsight}
          </p>
        </div>
      </div>
    </section>
  );
}
