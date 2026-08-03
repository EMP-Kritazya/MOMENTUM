import StreakBadge from "./StreakBadge";

export default function DashboardHeader({
  currDate,
  currTime,
  userName,
  streakDays,
}) {
  const greeting =
    Number(currTime) < 12
      ? "Good Morning, "
      : Number(currTime) < 18
        ? "Good Afternoon, "
        : "Good Evening, ";

  return (
    <header className="flex flex-col gap-4 md:flex-row sm:items-start sm:justify-between">
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-momentum-muted">
          {currDate}
        </p>
        <h1 className="mt-2 font-display text-4xl text-white sm:text-3xl">
          {greeting}
          {userName}
        </h1>
      </div>

      <StreakBadge days={streakDays} />
    </header>
  );
}
