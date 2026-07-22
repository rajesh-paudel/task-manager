import { Outlet } from "react-router-dom";
import Sidebar from "./DashboardSidebar";
import { useAppSelector } from "../../store/store";
import { useTasksSync } from "../../store/useTasksSync";
import { useState, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import ErrorBoundary from "../ErrorBoundary";

export default function DashboardLayout() {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  useTasksSync(userProfile?.uid);
  const [view, setView] = useState<"list" | "kanban">("list");
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      <Helmet>
        <title>Dashboard | TaskPulse </title>
        <meta
          name="description"
          content="TaskPulse is a modern task management platform to organize projects, track progress, and boost productivity."
        />
      </Helmet>
      <Sidebar />
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-full min-h-[calc(100vh-4rem)]">
                <div className="h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            }
          >
            <Outlet context={{ view, setView }} />
          </Suspense>
        </ErrorBoundary>
      </main>
    </div>
  );
}
