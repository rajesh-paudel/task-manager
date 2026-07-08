import { Outlet } from "react-router-dom";
import Sidebar from "./DashboardSidebar";
import { useAppSelector } from "../store/store";
import { useTasksSync } from "../store/useTasksSync";

export default function DashboardLayout() {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  useTasksSync(userProfile?.uid);

  return (
    <div className="min-h-screen flex bg-white font-sans">
      <Sidebar />
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}
