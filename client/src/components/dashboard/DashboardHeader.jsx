import StreakBadge from "./StreakBadge";
import Clock from "../utilities/Clock.jsx";

export default function DashboardHeader({ streakDays }) {
  const { greeting, currDate } = Clock();

  return (
    <header className="flex flex-col gap-4 md:flex-row sm:items-start sm:justify-between">
      <Clock />

      <StreakBadge days={streakDays} />
    </header>
  );
}
