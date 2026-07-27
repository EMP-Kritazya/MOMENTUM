// src/layouts/AppLayout.jsx
import { Outlet } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";

export default function AppLayout() {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <main className="flex-1 overflow-y-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}