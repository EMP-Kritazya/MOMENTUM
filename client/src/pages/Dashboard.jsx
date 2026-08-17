import DashboardHeader from "../components/dashboard/DashboardHeader";
import { TodaysWorkoutCard } from "../components/dashboard/TodaysWorkoutCard";
import ProgressInsightCard from "../components/dashboard/ProgressInsightCard";
import MonthlyActivityCard from "../components/dashboard/MonthlyActivityCard";
import WeeklyProgressCard from "../components/dashboard/WeeklyProgressCard";
import GroupProgressCard from "../components/dashboard/GroupProgressCard";
import { useAuth } from "../context/authContext";
import { replace } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LoaderScreen from "../components/utilities/LoaderScreen";
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
  const { user, loading } = useAuth();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  const nav = useNavigate();

  const displayName = user?.username ?? "";
  const current_streak = user?.current_streak ?? "";

  const currDate = currentDateTime.toLocaleString();
  const currHour = currentDateTime.getHours();

  useEffect(() => {
    if (!loading && user && !user.onboarded)
      nav("/onboarding", { replace: true });
  }, [loading, user, currDate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    // Clean up the interval when the component unmounts to prevent memory leaks
    return () => clearInterval(timer);
  }, []);

  if (loading) return <LoaderScreen />;

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
