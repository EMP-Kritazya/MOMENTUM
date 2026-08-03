import DashboardHeader from "../components/dashboard/DashboardHeader";
import TodayWorkoutCard from "../components/dashboard/TodayWorkoutCard";
import ProgressInsightCard from "../components/dashboard/ProgressInsightCard";
import MonthlyActivityCard from "../components/dashboard/MonthlyActivityCard";
import WeeklyProgressCard from "../components/dashboard/WeeklyProgressCard";
import GroupProgressCard from "../components/dashboard/GroupProgressCard";
import {
  user,
  todayDate,
  todayWorkout,
  progressInsight,
  monthlyActivity,
  weeklyProgress,
  groupProgress,
} from "../data/dashboardData";

export default function Dashboard() {
  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <DashboardHeader
        date={todayDate}
        userName={user.name}
        streakDays={user.streakDays}
      />

      <TodayWorkoutCard workout={todayWorkout} />

      <ProgressInsightCard insight={progressInsight} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MonthlyActivityCard activity={monthlyActivity} />
        <WeeklyProgressCard progress={weeklyProgress} />
        <GroupProgressCard group={groupProgress} />
      </div>
    </div>
  );
}
