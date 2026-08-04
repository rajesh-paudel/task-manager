import { CalendarDays, LayoutDashboard, Moon, Shield, Zap } from "lucide-react";
import Reveal from "../ui/Reveal";

function KanbanVisual() {
  const columns = [
    { name: "Todo", tasks: [{ t: "Write proposal", c: "bg-slate-400" }, { t: "Setup repo", c: "bg-indigo-400" }] },
    { name: "Doing", tasks: [{ t: "Design mockups", c: "bg-orange-400" }, { t: "API wiring", c: "bg-indigo-400" }] },
    { name: "Done", tasks: [{ t: "User research", c: "bg-emerald-400" }, { t: "QA pass", c: "bg-emerald-400" }] },
  ] as const;

  return (
    <div className="grid grid-cols-3 gap-3">
      {columns.map((col) => (
        <div key={col.name} className="rounded-xl bg-slate-50 p-3">
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">{col.name}</p>
          <div className="mt-2 space-y-2">
            {col.tasks.map((task) => (
              <div key={task.t} className="rounded-lg border border-slate-200 bg-white p-2 shadow-sm">
                <div className="flex items-center gap-1.5">
                  <span className={`h-2 w-2 rounded-full ${task.c}`} />
                  <p className="truncate text-[11px] font-semibold text-slate-700">{task.t}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function CalendarVisual() {
  const days = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
  const dots = [2, 4, 5, 6, 7];

  return (
    <div className="rounded-xl bg-slate-50 p-3">
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((d, i) => (
          <div key={d} className="flex flex-col items-center gap-1 rounded-lg py-1.5">
            <p className="text-[10px] font-bold text-slate-400">{d}</p>
            <p className={`text-[11px] font-semibold ${dots.includes(i + 1) ? "text-orange-600" : "text-slate-700"}`}>
              {i + 1}
            </p>
            {dots.includes(i + 1) && <span className="h-1 w-1 rounded-full bg-orange-500" />}
          </div>
        ))}
      </div>
    </div>
  );
}

function AnalyticsVisual() {
  const bars = [45, 70, 55, 85, 65, 95, 78];

  return (
    <div className="flex h-24 items-end gap-2 rounded-xl bg-slate-50 p-3">
      {bars.map((h, i) => (
        <div key={i} className="flex-1 overflow-hidden rounded-t-md bg-gradient-to-t from-orange-600 to-amber-400" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

const features = [
  {
    icon: Zap,
    title: "Boards that update live",
    description:
      "Push a task, every screen updates instantly. Firebase realtime sync keeps your team on the same page — no refresh, no stale tabs.",
    visual: <KanbanVisual />,
    span: "lg:col-span-4",
  },
  {
    icon: CalendarDays,
    title: "Calendar you can plan on",
    description: "See every deadline on a month view, drag and drop to reschedule.",
    visual: <CalendarVisual />,
    span: "lg:col-span-2",
  },
  {
    icon: LayoutDashboard,
    title: "Analytics at a glance",
    description: "Completion rates, workload, and velocity — charted on the overview.",
    visual: <AnalyticsVisual />,
    span: "lg:col-span-2",
  },
  {
    icon: Shield,
    title: "Role-based workspaces",
    description: "Admins get a full control panel; teammates get exactly what they need.",
    span: "lg:col-span-2",
  },
  {
    icon: Moon,
    title: "Dark mode, built in",
    description: "A toggle that follows your preference — every screen, every chart.",
    span: "lg:col-span-2",
  },
];

export default function Features() {
  return (
    <section className="mx-auto max-w-7xl border-t border-slate-200 px-4 py-20 sm:px-6 lg:px-8 lg:py-24">
      <Reveal className="mx-auto max-w-2xl text-center">
        <p className="text-sm font-bold uppercase tracking-widest text-orange-600">Features</p>
        <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
          Everything the work needs, nothing it doesn't
        </h2>
        <p className="mt-4 text-lg text-slate-500">
          One focused workspace for planning, tracking, and shipping your team's work.
        </p>
      </Reveal>

      <div className="mt-14 grid gap-5 lg:grid-cols-6">
        {features.map(({ icon: Icon, title, description, visual, span }, i) => (
          <Reveal key={title} delay={i * 0.08} className={span}>
            <div className="group flex h-full flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 sm:p-7">
              {visual && (
                <div className="mb-6 overflow-hidden rounded-xl border border-slate-200 bg-white p-3">
                  {visual}
                </div>
              )}
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600 transition-colors group-hover:bg-orange-600 group-hover:text-white">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">{title}</h3>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-slate-500">{description}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
