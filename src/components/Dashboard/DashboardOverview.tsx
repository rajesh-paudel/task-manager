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
import { getWeeklyCompletionCounts } from "../../utils/dateHelpers";
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  Loader2,
} from "lucide-react";

export default function Overview() {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const tasksStatus = useAppSelector((state) => state.tasks.status);
  const tasks = useAppSelector(selectAllTasks);
  const taskStats = useAppSelector(selectTaskStats);

  const weeklyCompletion = useMemo(
    () => getWeeklyCompletionCounts(tasks),
    [tasks],
  );

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
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
      <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
        {userProfile
          ? `Welcome back, ${userProfile.name.split(" ")[0]}`
          : "Overview"}
      </h1>
      <p className="mt-1 text-sm text-slate-500">
        Here's how work is moving this week.
      </p>

      {/* Stat cards */}
      <div className="mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon }) => (
          <div
            key={label}
            className="bg-white border border-slate-200 rounded-xl p-4"
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
      <div className="mt-6 grid sm:grid-cols-3 gap-4">
        <div className="sm:col-span-2 bg-white border border-slate-200 rounded-xl p-5">
          <h2 className="text-sm font-semibold text-slate-900">
            Tasks completed this week
          </h2>
          <div className="mt-4 h-56">
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
                  cursor={{ fill: "#f8fafc" }}
                  contentStyle={{
                    border: "1px solid #e2e8f0",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="completed" fill="#ea580c" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

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
              <div className="mt-2 h-40">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusBreakdown}
                      dataKey="value"
                      innerRadius={40}
                      outerRadius={60}
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
      </div>
    </div>
  );
}
