import { NavLink, useNavigate } from "react-router-dom";
import {
  Home,
  Calendar,
  Users,
  BookOpen,
  Flame,
  LogOut,
  Settings,
  X,
} from "lucide-react";
import { useEffect } from "react";
import { useAuth } from "../../context/authContext.js";

const navItems = [
  { to: "/history", label: "History", icon: Calendar },
  { to: "/groups", label: "Groups", icon: Users },
  { to: "/library", label: "Exercises", icon: BookOpen },
];

const adminNavItem = {
  to: "/admin/templates",
  label: "Manage Templates",
  icon: Settings,
};

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const navigate = useNavigate();
  const { user, loading, logout } = useAuth();

  useEffect(() => {
    if (!loading && !user) navigate("/", { replace: true });
  }, [loading, navigate, user]);

  const firstName = user?.firstname ?? "";
  const lastName = user?.lastname ?? "";
  const displayName =
    `${firstName} ${lastName}`.trim() || user?.username || "Momentum User";
  const initials =
    `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase() ||
    displayName.slice(0, 2).toUpperCase();
  const isAdmin = user?.role === "admin";
  const visibleNavItems = isAdmin ? [...navItems, adminNavItem] : navItems;

  async function handleLogout() {
    await logout();

    navigate(isAdmin ? "/admin/login" : "/", { replace: true });
  }

  return (
    <>
      {/* Backdrop: mobile only, dismisses the sidebar on outside click. */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 shrink-0 flex-col border-r border-border transition-transform duration-200 ease-out lg:static lg:z-auto lg:w-56 lg:translate-x-0 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--sidebar)" }}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <NavLink to="/dashboard" end onClick={onClose}>
            <span
              className="text-xl font-bold tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              <span className="text-primary">M</span>omentum
            </span>
          </NavLink>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-1.5 text-muted-foreground hover:bg-secondary hover:text-foreground lg:hidden"
            aria-label="Close menu"
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-0.5">
          {visibleNavItems.map(({ to, label, icon: Icon, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              onClick={onClose}
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

        {user && (
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
          {loading ? (
            // Placeholder while the current user is being resolved.
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-secondary animate-pulse shrink-0" />
              <div className="h-3 w-24 rounded bg-secondary animate-pulse" />
            </div>
          ) : user ? (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary shrink-0">
                {initials}
              </div>
              <div className="overflow-hidden">
                <div className="text-sm font-medium truncate">
                  {displayName}
                </div>
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Flame size={11} className="text-primary" />
                  {user?.current_streak ?? 0} day streak
                </div>
              </div>
            </div>
          ) : (
            <NavLink
              to="/"
              className="text-sm font-medium text-muted-foreground hover:text-foreground"
            >
              Sign in
            </NavLink>
          )}
        </div>
      </aside>
    </>
  );
}
