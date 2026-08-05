import DashboardHeader from "../components/dashboard/DashboardHeader";
import { TodaysWorkoutCard } from "../components/dashboard/TodaysWorkoutCard";
import ProgressInsightCard from "../components/dashboard/ProgressInsightCard";
import MonthlyActivityCard from "../components/dashboard/MonthlyActivityCard";
import WeeklyProgressCard from "../components/dashboard/WeeklyProgressCard";
import GroupProgressCard from "../components/dashboard/GroupProgressCard";
import { useAuth } from "../context/authContext";
// import {
//   user,
//   todayDate,
//   todayWorkout,
//   progressInsight,
//   monthlyActivity,
//   weeklyProgress,
//   groupProgress,
// } from "../data/dashboardData";

export default function Dashboard() {
  const { user, loading, logout } = useAuth();

  const displayName = user?.username ?? "";
  const current_streak = user?.current_streak ?? "";

  const date = new Date();
  const currDate = date.toLocaleString();
  const currHour = date.getHours();

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6">
      <DashboardHeader
        currDate={currDate}
        currTime={currHour}
        userName={displayName}
        streakDays={current_streak}
      />

      <TodaysWorkoutCard />

      <ProgressInsightCard />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <MonthlyActivityCard />
        <WeeklyProgressCard />
        <GroupProgressCard />
      </div>
    </div>
  );
}
