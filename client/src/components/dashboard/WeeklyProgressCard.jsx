import { CheckCircle2, Clock } from "lucide-react";
import ProgressBar from "./ProgressBar";
import StatItem from "./StatItem";

export const weeklyProgress = {
  title: "This Week's Progress",
  subtitle: "Last 8 weeks",
  // Relative bar heights (0–1) for the mini chart.
  bars: [
    { label: "W1", value: 0.45 },
    { label: "W2", value: 0.5 },
    { label: "W3", value: 0.4 },
    { label: "W4", value: 0.72 },
    { label: "W5", value: 0.6 },
    { label: "W6", value: 0.68 },
    { label: "W7", value: 0.85 },
    { label: "W8", value: 0.7 },
  ],
  workoutsCompleted: 4,
  workoutsGoal: 5,
  activeMinutes: 185,
  weeklyGoalPercent: 80,
};

function MiniBarChart({ bars }) {
  return (
    <div className="flex h-24 items-end justify-between gap-2">
      {bars.map((bar) => (
        <div
          key={bar.label}
          className="flex flex-1 flex-col items-center gap-2"
        >
          <div className="flex h-20 w-full items-end justify-center">
            <div
              className="w-full max-w-4.5 rounded-md bg-momentum-lime"
              style={{ height: `${Math.max(6, bar.value * 100)}%` }}
            />
          </div>
          <span className="text-[10px] font-medium text-momentum-muted">
            {bar.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function WeeklyProgressCard({ progress }) {
  const {
    title,
    subtitle,
    bars,
    workoutsCompleted,
    workoutsGoal,
    activeMinutes,
    weeklyGoalPercent,
  } = weeklyProgress;

  return (
    <section className="flex flex-col rounded-3xl border border-momentum-border bg-momentum-panel p-6">
      <div>
        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="text-sm text-momentum-muted">{subtitle}</p>
      </div>

      <div className="mt-6 mb-4">
        <MiniBarChart bars={bars} />
      </div>

      <div className="mt-6 border-t border-momentum-border/60 pt-4">
        <StatItem
          icon={CheckCircle2}
          label="Workouts completed"
          value={`${workoutsCompleted} / ${workoutsGoal}`}
        />
        <StatItem
          icon={Clock}
          label="Active minutes"
          value={`${activeMinutes} min`}
        />

        <div className="mt-3">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm text-momentum-muted">Weekly goal</span>
            <span className="text-sm font-semibold text-momentum-lime">
              {weeklyGoalPercent}%
            </span>
          </div>
          <ProgressBar value={weeklyGoalPercent} />
        </div>
      </div>
    </section>
  );
}
