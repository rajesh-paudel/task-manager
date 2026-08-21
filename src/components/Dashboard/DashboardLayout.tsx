import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "./DashboardSidebar";
import { useAppSelector } from "../../store/store";
import { useTasksSync } from "../../hooks/useTasksSync";
import { useWorkspacesSync } from "../../hooks/useWorkspacesSync";
import { useState, Suspense } from "react";
import { Helmet } from "react-helmet-async";
import ErrorBoundary from "../ui/ErrorBoundary";
import { SITE_URL } from "../../utils/constants";
import { AnimatePresence, motion } from "framer-motion";

export default function DashboardLayout() {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const activeWorkspaceId = useAppSelector(
    (state) => state.workspaces.activeWorkspaceId,
  );
  useWorkspacesSync(userProfile?.uid);
  useTasksSync(userProfile?.uid, activeWorkspaceId);
  const [view, setView] = useState<"list" | "kanban">("kanban");
  const location = useLocation();
  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white font-sans">
      <Helmet>
        <title>Dashboard | TaskPulse</title>
        <meta
          name="description"
          content="Manage your tasks, projects, and team workflow on the TaskPulse dashboard."
        />
        <meta name="robots" content="noindex, nofollow" />
        <link
          rel="canonical"
          href={`${SITE_URL}/dashboard`}
        />
      </Helmet>
      <Sidebar />
      <main className="flex-1 bg-slate-50 overflow-y-auto">
        <ErrorBoundary key={location.pathname}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15, ease: "easeOut" }}
            >
              <Suspense
                fallback={
                  <div className="flex items-center justify-center h-full min-h-[calc(100vh-4rem)]">
                    <div className="h-8 w-8 border-4 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
                  </div>
                }
              >
                <Outlet context={{ view, setView }} />
              </Suspense>
            </motion.div>
          </AnimatePresence>
        </ErrorBoundary>
      </main>
    </div>
  );
}
