// src/layouts/AppLayout.jsx
import { useState } from "react";
import { Outlet, NavLink } from "react-router-dom";
import { Menu } from "lucide-react";
import Sidebar from "../components/sidebar/Sidebar";

export default function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        {/* Mobile-only top bar: the sidebar is off-canvas below lg, so this
            is the only way to reach it on a phone-width screen. */}
        <header className="flex items-center gap-3 border-b border-border px-4 py-3 lg:hidden">
          <button
            type="button"
            onClick={() => setSidebarOpen(true)}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Open menu"
          >
            <Menu size={20} aria-hidden="true" />
          </button>
          <NavLink to="/momentum" end>
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: "'Fraunces', serif" }}
            >
              <span className="text-primary">M</span>omentum
            </span>
          </NavLink>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
