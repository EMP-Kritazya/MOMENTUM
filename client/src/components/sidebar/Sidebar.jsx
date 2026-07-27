import { NavLink } from "react-router-dom";

const links = [
  { to: "/", label: "Dashboard" },
  { to: "/workouts", label: "Workout History" },
  { to: "/library", label: "Exercise Library" },
  { to: "/groups", label: "Accountability Groups" }
];

export default function Sidebar() {
  return (
    <aside className="w-64 shrink-0 border-r border-gray-200 bg-white p-4">
      <h1 className="mb-6 text-xl font-bold text-gray-800">Momentum</h1>
      <nav className="flex flex-col gap-1">
        {links.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === "/"}
            className={({ isActive }) =>
              `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                isActive
                  ? "bg-indigo-50 text-indigo-600"
                  : "text-gray-600 hover:bg-gray-100"
              }`
            }
          >
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}