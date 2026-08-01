import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Users,
  BookOpen,
  Flame,
  LogOut,
} from "lucide-react";

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: Home, end: true },
  { to: "/history", label: "History", icon: Calendar },
  { to: "/groups", label: "Groups", icon: Users },
  { to: "/library", label: "Exercises", icon: BookOpen },
];

function readStoredJson(key) {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch {
    return null;
  }
}

export default function Sidebar() {
  const navigate = useNavigate();
  const adminSession = readStoredJson("momentumAdminSession");
  const memberRecord = readStoredJson("momentumUser");
  const memberUser = memberRecord?.user ?? memberRecord;
  const currentUser = adminSession?.user ?? memberUser;

  const isAdmin = adminSession?.user?.role === "admin";
  const firstName = currentUser?.first_name ?? currentUser?.firstName ?? "";
  const lastName = currentUser?.last_name ?? currentUser?.lastName ?? "";
  const displayName =
    `${firstName} ${lastName}`.trim() ||
    currentUser?.username ||
    "Momentum User";
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
    displayName.slice(0, 2).toUpperCase();

  function handleLogout() {
    if (isAdmin) {
      localStorage.removeItem("momentumAdminSession");
      navigate("/admin/login", { replace: true });
      return;
    }

    localStorage.removeItem("momentumUser");
    navigate("/", { replace: true });
  }

  return (
    <aside
      className="w-56 border-r border-border flex flex-col shrink-0"
      style={{ background: "var(--sidebar)" }}
    >
      <div className="px-6 py-5 border-b border-border">
        <span
          className="text-xl font-bold tracking-tight"
          style={{ fontFamily: "'Fraunces', serif" }}
        >
          <span className="text-primary">M</span>omentum
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 ${
                isActive
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`
            }
          >
            <Icon size={16} />
            {label}
          </NavLink>
        ))}
      </nav>

      {currentUser && (
        <div className="border-t border-border px-3 py-3">
          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
          >
            <LogOut size={16} aria-hidden="true" />
            Log out
          </button>
        </div>
      )}

      <div className="px-4 py-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <div className="text-sm font-medium truncate">{displayName}</div>
            <div className="text-xs text-muted-foreground flex items-center gap-1">
              <Flame size={11} className="text-primary" /> 12 day streak
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
