import { CheckCircle2, Clock } from "lucide-react";
import ProgressBar from "./ProgressBar";
import StatItem from "./StatItem";

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
  } = progress;

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
