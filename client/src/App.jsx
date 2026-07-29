// App.jsx
import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Dashboard from "./pages/Dashboard";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import OnboardingPage from "./pages/OnboardingPage";
import History from "./pages/History";
import WorkoutGroups from "./pages/WorkoutGroups";

export default function App() {
  return (
    <Routes>
      {/* No sidebar for onboarding */}
      <Route path="/onboarding" element={<OnboardingPage />} />

      {/* Everything else shares the sidebar layout */}
      <Route element={<AppLayout />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/library" element={<ExerciseLibrary />} />
        <Route path="/groups" element={<WorkoutGroups />} />
      </Route>
    </Routes>
  );
}