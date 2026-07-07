import { Outlet } from "react-router-dom";
import Sidebar from "./DashboardSidebar";
export default function DashboardLayout() {
  return (
    <div className="min-h-screen flex bg-white font-sans">
      <Sidebar />
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
