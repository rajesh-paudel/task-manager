import { Outlet } from "react-router-dom";
import Sidebar from "./DashboardSidebar";
import { useAppSelector } from "../store/store";
import { useTasksSync } from "../store/useTasksSync";
import { Suspense } from "react";

export default function DashboardLayout() {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  useTasksSync(userProfile?.uid);

  return (
    <div className="min-h-screen flex bg-white font-sans">
      <Sidebar />
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <Suspense
          fallback={
            <div className="flex items-center justify-center h-full min-h-[calc(100vh-4rem)]">
              <div className="h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
          }
        >
          <Outlet />
        </Suspense>
      </main>
    </div>
  );
}
