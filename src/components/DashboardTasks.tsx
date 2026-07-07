import { useState } from "react";
import {
  Plus,
  LayoutList,
  KanbanSquare,
  Circle,
  CheckCircle2,
} from "lucide-react";

type Status = "todo" | "in_progress" | "done";

interface Task {
  id: string;
  title: string;
  status: Status;
  dueDate?: string;
}

// Placeholder data — replace with your real tasks slice / Firebase list
const initialTasks: Task[] = [
  { id: "1", title: "Wireframe homepage", status: "done", dueDate: "Jun 2" },
  {
    id: "2",
    title: "Review copy with Sarah",
    status: "in_progress",
    dueDate: "Today",
  },
  {
    id: "3",
    title: "Client feedback call",
    status: "todo",
    dueDate: "Tomorrow",
  },
  { id: "4", title: "Ship staging build", status: "todo", dueDate: "Fri" },
];

const columns: { key: Status; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [view, setView] = useState<"list" | "kanban">("list");
  const [newTask, setNewTask] = useState("");

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;
    setTasks((prev) => [
      { id: crypto.randomUUID(), title: newTask.trim(), status: "todo" },
      ...prev,
    ]);
    setNewTask("");
  };

  const toggleDone = (id: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === id
          ? { ...t, status: t.status === "done" ? "todo" : "done" }
          : t,
      ),
    );
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-10">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Tasks
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            {tasks.length} tasks across your workspace.
          </p>
        </div>

        <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
          <button
            onClick={() => setView("list")}
            className={`h-8 w-8 flex items-center justify-center rounded-md ${
              view === "list"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            aria-label="List view"
          >
            <LayoutList className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("kanban")}
            className={`h-8 w-8 flex items-center justify-center rounded-md ${
              view === "kanban"
                ? "bg-indigo-50 text-indigo-600"
                : "text-slate-400 hover:text-slate-600"
            }`}
            aria-label="Kanban view"
          >
            <KanbanSquare className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Add task */}
      <form onSubmit={addTask} className="mt-6 flex items-center gap-2">
        <input
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="Add a task and press enter"
          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500"
        />
        <button
          type="submit"
          className="h-[38px] w-[38px] shrink-0 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
          aria-label="Add task"
        >
          <Plus className="h-4 w-4" />
        </button>
      </form>

      {/* List view */}
      {view === "list" && (
        <div className="mt-6 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          {tasks.map((task) => (
            <div key={task.id} className="flex items-center gap-3 px-4 py-3">
              <button onClick={() => toggleDone(task.id)} className="shrink-0">
                {task.status === "done" ? (
                  <CheckCircle2 className="h-4.5 w-4.5 text-indigo-600" />
                ) : (
                  <Circle className="h-4.5 w-4.5 text-slate-300" />
                )}
              </button>
              <span
                className={`text-sm flex-1 ${
                  task.status === "done"
                    ? "text-slate-400 line-through"
                    : "text-slate-900"
                }`}
              >
                {task.title}
              </span>
              {task.dueDate && (
                <span className="text-xs text-slate-400">{task.dueDate}</span>
              )}
            </div>
          ))}
          {tasks.length === 0 && (
            <p className="px-4 py-8 text-sm text-slate-400 text-center">
              No tasks yet — add your first one above.
            </p>
          )}
        </div>
      )}

      {/* Kanban view */}
      {view === "kanban" && (
        <div className="mt-6 grid sm:grid-cols-3 gap-4">
          {columns.map((col) => {
            const colTasks = tasks.filter((t) => t.status === col.key);
            return (
              <div key={col.key} className="bg-slate-100/60 rounded-xl p-3">
                <div className="flex items-center justify-between px-1">
                  <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    {col.label}
                  </h3>
                  <span className="text-xs text-slate-400">
                    {colTasks.length}
                  </span>
                </div>
                <div className="mt-3 space-y-2">
                  {colTasks.map((task) => (
                    <div
                      key={task.id}
                      className="bg-white border border-slate-200 rounded-lg px-3 py-2.5"
                    >
                      <p className="text-sm text-slate-900">{task.title}</p>
                      {task.dueDate && (
                        <p className="mt-1 text-xs text-slate-400">
                          {task.dueDate}
                        </p>
                      )}
                    </div>
                  ))}
                  {colTasks.length === 0 && (
                    <p className="text-xs text-slate-400 px-1 py-2">
                      Nothing here
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
