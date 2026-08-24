import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useAppSelector } from "../../store/store";
import { selectAllTasks, selectTaskStats } from "../../store/tasksSelectors";
import { getWeeklyCompletionCounts, startOfDay } from "../../utils/dateHelpers";
import type { TaskPriority } from "../../types/task";
import { useTheme } from "../../context/useTheme";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
} from "lucide-react";
import { selectActiveWorkspace } from "../../store/workspaceSelectors";

const priorityColors: Record<TaskPriority, string> = {
  low: "#94a3b8",
  medium: "#3b82f6",
  high: "#8b5cf6",
  urgent: "#ef4444",
};

const priorityLabels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export default function Overview() {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const activeWorkspace = useAppSelector(selectActiveWorkspace);
  const tasksStatus = useAppSelector((state) => state.tasks.status);
  const tasks = useAppSelector(selectAllTasks);
  const taskStats = useAppSelector(selectTaskStats);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const weeklyCompletion = useMemo(
    () => getWeeklyCompletionCounts(tasks),
    [tasks],
  );

  const priorityCounts = useMemo(() => {
    const counts: Record<TaskPriority, number> = {
      low: 0,
      medium: 0,
      high: 0,
      urgent: 0,
    };
    for (const task of tasks) counts[task.priority] += 1;
    return counts;
  }, [tasks]);

  const priorityData = (
    Object.keys(priorityCounts) as TaskPriority[]
  ).map((priority) => ({
    priority: priorityLabels[priority],
    count: priorityCounts[priority],
    color: priorityColors[priority],
  }));
  const maxPriorityCount = Math.max(...Object.values(priorityCounts), 1);

  const completedThisWeek = useMemo(
    () => weeklyCompletion.reduce((sum, d) => sum + d.completed, 0),
    [weeklyCompletion],
  );

  const daysActive = useMemo(
    () => weeklyCompletion.filter((d) => d.completed > 0).length,
    [weeklyCompletion],
  );

  const dueThisWeek = useMemo(() => {
    const today = startOfDay(new Date());
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() - 6);
    const end = today.getTime() + 86400000 - 1;
    return tasks.filter(
      (t) =>
        t.status !== "done" &&
        t.dueDate != null &&
        t.dueDate >= weekStart.getTime() &&
        t.dueDate <= end,
    ).length;
  }, [tasks]);

  const statusBreakdown = [
    { name: "Done", value: taskStats.done, color: "#ea580c" },
    { name: "In progress", value: taskStats.inProgress, color: "#fdba74" },
    { name: "To do", value: taskStats.todo, color: "#e2e8f0" },
  ];

  const stats = [
    { label: "Total tasks", value: taskStats.total, icon: ListTodo },
    { label: "Completed", value: taskStats.done, icon: CheckCircle2 },
    { label: "In progress", value: taskStats.inProgress, icon: Clock },
    { label: "Overdue", value: taskStats.overdue, icon: AlertCircle },
  ];

  if (tasksStatus === "loading" || tasksStatus === "idle") {
    return (
      <div className="min-h-screen max-w-5xl mx-auto px-6 sm:px-8 py-10">
        <div className="h-7 w-56 bg-slate-200 animate-pulse rounded-md" />
        <div className="mt-2 h-4 w-72 bg-slate-200 animate-pulse rounded-md" />
        <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-24 bg-white border border-slate-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="sm:col-span-2 h-80 bg-white border border-slate-200 rounded-xl animate-pulse" />
          <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
            <div className="h-52 bg-white border border-slate-200 rounded-xl animate-pulse" />
            <div className="h-44 bg-white border border-slate-200 rounded-xl animate-pulse" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 sm:px-8 py-10">
      <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
        {userProfile
          ? `Welcome back, ${userProfile.name.split(" ")[0]}`
          : "Overview"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Here's how{" "}
        {activeWorkspace ? activeWorkspace.name : "your personal board"} is
        moving this week.
      </p>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border border-slate-200 rounded-xl p-4 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift"
          >
            <Icon className="h-4 w-4 text-orange-600" />
            <p className="mt-3 text-2xl font-semibold text-slate-900">
              {value}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Tasks completed this week
          </h2>
          <div className="mt-4 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyCompletion}>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: "#94a3b8" }}
                  width={24}
                  allowDecimals={false}
                />
                <Tooltip
                  cursor={{ fill: isDark ? "#1e293b" : "#f8fafc" }}
                  contentStyle={{
                    border: `1px solid ${isDark ? "#334155" : "#e2e8f0"}`,
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="completed" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Weekly summary */}
          <div className="mt-8 pt-6 border-t border-slate-100">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
              Weekly summary
            </p>
            <div className="mt-4 grid grid-cols-3 divide-x divide-slate-100">
              {[
                {
                  label: "Completed",
                  value: completedThisWeek,
                  dot: "bg-orange-500",
                },
                { label: "Due", value: dueThisWeek, dot: "bg-slate-400" },
                {
                  label: "Days active",
                  value: `${daysActive}/7`,
                  dot: "bg-blue-500",
                },
              ].map((stat) => (
                <div
                  key={stat.label}
                  className="px-4 first:pl-0 last:pr-0 text-center"
                >
                  <p className="text-xl font-semibold text-slate-900 leading-tight">
                    {stat.value}
                  </p>
                  <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-500">
                    <span className={`h-1.5 w-1.5 rounded-full ${stat.dot}`} />
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4 sm:col-span-2 lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-900">
              Status breakdown
            </h2>
            {taskStats.total === 0 ? (
              <p className="mt-8 text-sm text-slate-400 text-center">
                No tasks yet.
              </p>
            ) : (
              <>
                <div className="mt-2 h-36">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={statusBreakdown}
                        dataKey="value"
                        innerRadius={40}
                        outerRadius={58}
                        paddingAngle={2}
                      >
                        {statusBreakdown.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="mt-2 space-y-1.5">
                  {statusBreakdown.map((s) => (
                    <div
                      key={s.name}
                      className="flex items-center gap-2 text-xs text-slate-500"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ background: s.color }}
                      />
                      {s.name}
                      <span className="ml-auto text-slate-900 font-medium">
                        {s.value}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>

          {taskStats.total > 0 && (
            <div className="bg-white border border-slate-200 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-900">
                Tasks by priority
              </h2>
              <div className="mt-4 space-y-3.5">
                {priorityData.map((entry) => (
                  <div key={entry.priority}>
                    <div className="flex items-center justify-between text-xs">
                      <span className="flex items-center gap-1.5 text-slate-500">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ background: entry.color }}
                        />
                        {entry.priority}
                      </span>
                      <span className="font-medium text-slate-900">
                        {entry.count}
                      </span>
                    </div>
                    <div className="mt-1.5 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          width: `${(entry.count / maxPriorityCount) * 100}%`,
                          background: entry.color,
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
