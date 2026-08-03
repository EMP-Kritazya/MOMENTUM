import StreakBadge from "./StreakBadge";

export default function DashboardHeader({ date, userName, streakDays }) {
  return (
    <header className="flex flex-col gap-4 md:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-momentum-muted">
          {date}
        </p>
        <h1 className="mt-2 font-display text-4xl text-white sm:text-3xl">
          Good morning, {userName}.
        </h1>
      </div>

      <StreakBadge days={streakDays} />
    </header>
  );
}
