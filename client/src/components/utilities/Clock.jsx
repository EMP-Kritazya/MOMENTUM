import React, { useState, useEffect } from "react";
import LoaderScreen from "./LoaderScreen";
import { useAuth } from "../../context/authContext";

function Clock() {
  const { user, loading } = useAuth();

  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (loading) {
    return <LoaderScreen />;
  }

  const displayName = user?.username ?? "";

  const currDate = currentDateTime.toLocaleString();

  const currHour = currentDateTime.getHours();

  const greeting =
    Number(currentDateTime.getHours()) < 12
      ? "Good Morning, "
      : Number(currentDateTime.getHours()) < 18
        ? "Good Afternoon, "
        : "Good Evening, ";

  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-widest text-momentum-muted">
        {currDate}
      </p>
      <h1 className="mt-2 font-display text-4xl text-white sm:text-3xl">
        {greeting}
        {displayName}
      </h1>
    </div>
  );
}

export default Clock;
