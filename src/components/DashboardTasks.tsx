import { useState } from "react";
import {
  Plus,
  LayoutList,
  KanbanSquare,
  Circle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import type { TaskStatus } from "../types/task";
import { selectAllTasks } from "../store/tasksSelectors";
import { createTask, setTaskStatus } from "../store/tasksAPi";
import { getDueLabel, isOverdue } from "../store/dateHelpers";
import { useAppSelector } from "../store/store";
const columns: { key: TaskStatus; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

export default function Tasks() {
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const tasksStatus = useAppSelector((state) => state.tasks.status);
  const tasks = useAppSelector(selectAllTasks);

  const [view, setView] = useState<"list" | "kanban">("list");
  const [newTask, setNewTask] = useState("");
  const [adding, setAdding] = useState(false);
  const [error, setError] = useState("");

  const addTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim() || !userProfile) return;

    setAdding(true);
    setError("");
    try {
      await createTask(userProfile.uid, {
        title: newTask.trim(),
        description: "",
        priority: "medium",
        dueDate: null,
        status: "todo",
      });
      setNewTask("");
    } catch (err: any) {
      setError(err.message || "Couldn't add task. Try again.");
    } finally {
      setAdding(false);
    }
  };

  const toggleDone = async (taskId: string, currentStatus: TaskStatus) => {
    if (!userProfile) return;
    try {
      await setTaskStatus(
        userProfile.uid,
        taskId,
        currentStatus === "done" ? "todo" : "done",
      );
    } catch (err: any) {
      setError(err.message || "Couldn't update task. Try again.");
    }
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
          disabled={adding}
          className="flex-1 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-indigo-500 disabled:opacity-50"
        />
        <button
          type="submit"
          disabled={adding}
          className="h-[38px] w-[38px] shrink-0 flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white disabled:opacity-50"
          aria-label="Add task"
        >
          {adding ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Plus className="h-4 w-4" />
          )}
        </button>
      </form>

      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}

      {tasksStatus === "loading" || tasksStatus === "idle" ? (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
        </div>
      ) : (
        <>
          {/* List view */}
          {view === "list" && (
            <div className="mt-6 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {tasks.map((task) => {
                const dueLabel = getDueLabel(task.dueDate);
                const overdue = isOverdue(task);
                return (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 px-4 py-3"
                  >
                    <button
                      onClick={() => toggleDone(task.id, task.status)}
                      className="shrink-0"
                    >
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
                    {dueLabel && (
                      <span
                        className={`text-xs ${
                          overdue
                            ? "text-red-500 font-medium"
                            : "text-slate-400"
                        }`}
                      >
                        {dueLabel}
                      </span>
                    )}
                  </div>
                );
              })}
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
                      {colTasks.map((task) => {
                        const dueLabel = getDueLabel(task.dueDate);
                        const overdue = isOverdue(task);
                        return (
                          <div
                            key={task.id}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2.5"
                          >
                            <p className="text-sm text-slate-900">
                              {task.title}
                            </p>
                            {dueLabel && (
                              <p
                                className={`mt-1 text-xs ${
                                  overdue
                                    ? "text-red-500 font-medium"
                                    : "text-slate-400"
                                }`}
                              >
                                {dueLabel}
                              </p>
                            )}
                          </div>
                        );
                      })}
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
        </>
      )}
    </div>
  );
}
