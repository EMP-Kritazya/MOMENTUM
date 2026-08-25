import StreakBadge from "./StreakBadge";
import Clock from "../utilities/Clock.jsx";

export default function DashboardHeader({ streakDays }) {
  const { greeting, currDate } = Clock();

  return (
    <header className="flex flex-row gap-0 md:gap-4  md:items-start justify-between">
      <Clock />

      <StreakBadge days={streakDays} />
    </header>
  );
}
