import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Reveal from "../ui/Reveal";
import { useTheme } from "../../context/useTheme";
import dashboardLight from "../../assets/dashboardLight.png";
import dashboardDark from "../../assets/dashboardDark.png";
import taskListLight from "../../assets/taskListLight.png";
import taskListDark from "../../assets/taskListDark.png";
import taskKanbanLight from "../../assets/taskKanbanLight.png";
import taskKanbanDark from "../../assets/taskKanbanDark.png";
import calendarLight from "../../assets/calendarLight.png";
import calendarDark from "../../assets/calendarDark.png";
import adminLight from "../../assets/adminLight.png";
import adminDark from "../../assets/adminDark.png";

const views = [
  {
    id: "overview",
    label: "Overview",
    light: dashboardLight,
    dark: dashboardDark,
    title: "Plan your week at a glance",
    description:
      "Completion trends, status breakdown, and priority mix all on one screen.",
  },
  {
    id: "task-list",
    label: "Task list",
    light: taskListLight,
    dark: taskListDark,
    title: "List view — the full picture",
    description:
      "Search, filter, and edit tasks in place without leaving the page.",
  },
  {
    id: "kanban",
    label: "Kanban board",
    light: taskKanbanLight,
    dark: taskKanbanDark,
    title: "Kanban — move work forward",
    description:
      "Drag tasks across To do, In progress, and Done with realtime sync across your devices.",
  },
  {
    id: "calendar",
    label: "Calendar",
    light: calendarLight,
    dark: calendarDark,
    title: "Calendar — see deadlines in context",
    description:
      "Every due date on one month grid, so you can plan around what's coming.",
  },
  {
    id: "admin",
    label: "Admin",
    light: adminLight,
    dark: adminDark,
    title: "Admin — keep the workspace healthy",
    description:
      "Manage users, roles, and contact messages from one dedicated panel.",
  },
];

export default function ProductTour() {
  const [activeIndex, setActiveIndex] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const active = views[activeIndex];
  const activeSrc = isDark ? active.dark : active.light;

  return (
    <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-medium uppercase tracking-widest text-orange-600">
          Product tour
        </p>
        <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          See it in action
        </h2>
        <p className="mt-4 text-lg text-slate-500">
          A quick walk through the workspace — every screen your team will use.
        </p>
      </Reveal>

      <Reveal delay={0.1}>
        <div
          role="tablist"
          aria-label="Product views"
          className="mt-12 flex flex-wrap justify-center gap-2"
        >
          {views.map((view, i) => (
            <button
              key={view.id}
              role="tab"
              id={`tour-tab-${view.id}`}
              aria-selected={i === activeIndex}
              aria-controls={`tour-panel-${view.id}`}
              onClick={() => setActiveIndex(i)}
              className={`rounded-full border px-4 py-2 text-sm font-medium transition ${i === activeIndex
                  ? "border-orange-600 bg-orange-600 text-white shadow-sm"
                  : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 hover:text-slate-900"
                }`}
            >
              {view.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            role="tabpanel"
            id={`tour-panel-${active.id}`}
            aria-labelledby={`tour-tab-${active.id}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mx-auto mt-8 max-w-4xl"
          >
            <div className="overflow-hidden rounded-xl bg-white ring-1 ring-slate-900/5 shadow-2xl shadow-slate-900/10">
              <img
                src={activeSrc}
                alt={`${active.title} screenshot`}
                className="block h-auto w-full"

              />
            </div>
            <div className="mt-6 text-center">
              <h3 className="text-lg font-semibold text-slate-900">
                {active.title}
              </h3>
              <p className="mx-auto mt-1.5 max-w-xl text-sm leading-relaxed text-slate-500">
                {active.description}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </Reveal>
    </section>
  );
}
