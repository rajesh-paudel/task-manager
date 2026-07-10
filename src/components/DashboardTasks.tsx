import { useState } from "react";
import {
  Plus,
  LayoutList,
  KanbanSquare,
  Circle,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import type { NewTask, Task, TaskStatus } from "../types/task";
import { selectAllTasks } from "../store/tasksSelectors";
import TaskModal from "./TaskModal";

import { createTask, updateTask, deleteTask } from "../store/tasksAPi";
import { getDueLabel, isOverdue } from "../store/dateHelpers";
import { useAppSelector } from "../store/store";

import PriorityBadge from "./PriorityBadge";

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
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [error, setError] = useState("");

  const openCreateModal = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleDeleteTask = async () => {
    if (!userProfile || !editingTask) return;
    await deleteTask(userProfile.uid, editingTask.id);
  };
  const handleSaveTask = async (data: NewTask) => {
    if (!userProfile) return;
    if (editingTask) {
      await updateTask(userProfile.uid, editingTask, data);
    } else {
      await createTask(userProfile.uid, data);
    }
  };

  const toggleDone = async (
    e: React.MouseEvent,
    task: Task,
    currentStatus: TaskStatus,
  ) => {
    e.stopPropagation();
    if (!userProfile) return;
    try {
      await updateTask(userProfile.uid, task, {
        ...task,
        status: currentStatus === "done" ? "todo" : "done",
      });
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

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-lg p-1">
            <button
              onClick={() => setView("list")}
              className={`h-8 w-8 flex items-center justify-center rounded-md ${
                view === "list"
                  ? "bg-orange-50 text-orange-600"
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
                  ? "bg-orange-50 text-orange-600"
                  : "text-slate-400 hover:text-slate-600"
              }`}
              aria-label="Kanban view"
            >
              <KanbanSquare className="h-4 w-4" />
            </button>
          </div>

          <button
            onClick={openCreateModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700"
          >
            <Plus className="h-4 w-4" />
            New task
          </button>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {tasksStatus === "loading" || tasksStatus === "idle" ? (
        <div className="mt-10 flex justify-center">
          <Loader2 className="h-5 w-5 text-orange-600 animate-spin" />
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
                    onClick={() => openEditModal(task)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50"
                  >
                    <button
                      onClick={(e) => toggleDone(e, task, task.status)}
                      className="shrink-0"
                    >
                      {task.status === "done" ? (
                        <CheckCircle2 className="h-4.5 w-4.5 text-orange-600" />
                      ) : (
                        <Circle className="h-4.5 w-4.5 text-slate-300" />
                      )}
                    </button>
                    <span
                      className={`text-sm flex-1 truncate ${
                        task.status === "done"
                          ? "text-slate-400 line-through"
                          : "text-slate-900"
                      }`}
                    >
                      {task.title}
                    </span>
                    <PriorityBadge priority={task.priority} />
                    {dueLabel && (
                      <span
                        className={`text-xs shrink-0 ${
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
                <div className="px-4 py-12 text-center">
                  <p className="text-sm text-slate-400">No tasks yet.</p>
                  <button
                    onClick={openCreateModal}
                    className="mt-2 text-sm font-medium text-orange-600 hover:text-orange-700"
                  >
                    Add your first task
                  </button>
                </div>
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
                            onClick={() => openEditModal(task)}
                            className="bg-white border border-slate-200 rounded-lg px-3 py-2.5 cursor-pointer hover:border-slate-300"
                          >
                            <p className="text-sm text-slate-900">
                              {task.title}
                            </p>
                            <div className="mt-2 flex items-center justify-between gap-2">
                              <PriorityBadge priority={task.priority} />
                              {dueLabel && (
                                <span
                                  className={`text-xs shrink-0 ${
                                    overdue
                                      ? "text-red-500 font-medium"
                                      : "text-slate-400"
                                  }`}
                                >
                                  {dueLabel}
                                </span>
                              )}
                            </div>
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

      <TaskModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSaveTask}
        onDelete={editingTask ? handleDeleteTask : undefined}
        initialTask={editingTask}
      />
    </div>
  );
}
