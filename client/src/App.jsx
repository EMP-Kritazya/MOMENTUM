// App.jsx
import { Navigate, Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import AdminLoginPage from "./pages/AdminLoginPage";
import Dashboard from "./pages/Dashboard";
import ExerciseLibrary from "./pages/ExerciseLibrary";
import OnboardingPage from "./pages/OnboardingPage";
import History from "./pages/History";
import WorkoutGroups from "./pages/WorkoutGroups";
import LoginPage from "./pages/LoginPage";
import ActiveWorkout from "./pages/ActiveWorkout";

export default function App() {
  return (
    <Routes>
      {/* Public page that does not display the application sidebar*/}
      <Route path="/" element={<OnboardingPage />} />
      <Route path="/admin/login" element={<AdminLoginPage />}></Route>
      <Route path="/login" element={<LoginPage />} />

      {/* Full-screen focused workout runner (no sidebar). */}
      <Route path="/workout/active" element={<ActiveWorkout />} />

      {/* Everything else shares the sidebar layout */}
      <Route element={<AppLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/history" element={<History />} />
        <Route path="/library" element={<ExerciseLibrary />} />
        <Route path="/groups" element={<WorkoutGroups />} />
      </Route>

      {/* Unknown URL returns to onboarding. */}
      <Route path="*" element={<Navigate to="/" replace />}></Route>
    </Routes>
  );
}
