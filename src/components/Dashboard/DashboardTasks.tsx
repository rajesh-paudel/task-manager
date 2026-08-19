import { useState, useMemo, useRef, useEffect, useCallback } from "react";
import {
  Plus,
  LayoutList,
  KanbanSquare,
  Circle,
  CheckCircle2,
  Search,
  Download,
  Upload,
} from "lucide-react";

import type { NewTask, Task, TaskPriority, TaskStatus } from "../../types/task";
import {
  selectAllTasks,
  selectTasksByDueDate,
} from "../../store/tasksSelectors";
import TaskModal from "./TaskModal";
import { useOutletContext } from "react-router-dom";
import { createTask, updateTask, deleteTask, importTasks } from "../../api/tasks";
import { parseTasksJson } from "../../utils/taskImport";
import { getDueLabel, isOverdue } from "../../utils/dateHelpers";
import { getErrorMessage } from "../../utils/firebaseErrors";
import { useAppSelector } from "../../store/store";
import { useSearchParams } from "react-router-dom";
import PriorityBadge from "../ui/PriorityBadge";
import TaskDetailsModal from "./TaskDetailModal";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { useToast } from "../../context/useToast";

const columns: { key: TaskStatus; label: string }[] = [
  { key: "todo", label: "To do" },
  { key: "in_progress", label: "In progress" },
  { key: "done", label: "Done" },
];

type SortBy = "newest" | "dueDate";
interface DashboardContextType {
  view: "list" | "kanban";
  setView: React.Dispatch<React.SetStateAction<"list" | "kanban">>;
}

export default function Tasks() {
  const searchRef = useRef<HTMLInputElement>(null);
  const { view, setView } = useOutletContext<DashboardContextType>();
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const tasksStatus = useAppSelector((state) => state.tasks.status);
  const tasks = useAppSelector(selectAllTasks);
  const tasksByDue = useAppSelector(selectTasksByDueDate);

  const [searchParams, setSearchParams] = useSearchParams();
  const priority =
    (searchParams.get("priority") as TaskPriority | "all") || "all";
  const sort = (searchParams.get("sort") as SortBy) ?? "newest";
  const status = (searchParams.get("status") as TaskStatus | "all") || "all";
  const [searchQuery, setSearchQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [detailsTask, setDetailsTask] = useState<Task | null>(null);
  const [error, setError] = useState("");
  const { showToast } = useToast();

  const [exportModalOpen, setExportModalOpen] = useState(false);
  const [exportScope, setExportScope] = useState<"all" | "current">("current");
  const [exportFormat, setExportFormat] = useState<"json" | "csv">("json");

  const [importModalOpen, setImportModalOpen] = useState(false);
  const [importFile, setImportFile] = useState<File | null>(null);
  const [importLoading, setImportLoading] = useState(false);
  const [importMessage, setImportMessage] = useState<{
    text: string;
    isError: boolean;
  } | null>(null);
  const importFileRef = useRef<HTMLInputElement>(null);

  const openImportModal = () => {
    setImportFile(null);
    setImportMessage(null);
    setImportModalOpen(true);
  };

  const handleImport = async () => {
    if (!importFile || !userProfile) return;
    setImportLoading(true);
    setImportMessage(null);
    try {
      const content = await importFile.text();
      const { tasks, skipped } = parseTasksJson(content);
      if (tasks.length === 0) {
        setImportMessage({
          text: "No valid tasks found in the file.",
          isError: true,
        });
        return;
      }
      await importTasks(userProfile.uid, tasks);
      const message = `Imported ${tasks.length} task${tasks.length === 1 ? "" : "s"}${
        skipped > 0 ? `, skipped ${skipped}` : ""
      }.`;
      setImportMessage({ text: message, isError: false });
      showToast(message);
    } catch (err: unknown) {
      setImportMessage({
        text: getErrorMessage(err, "Couldn't import tasks. Try again."),
        isError: true,
      });
    } finally {
      setImportLoading(false);
      if (importFileRef.current) importFileRef.current.value = "";
    }
  };

  const openCreateModal = useCallback(() => {
    setEditingTask(null);
    setModalOpen(true);
  }, []);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      if (e.key === "/") {
        e.preventDefault();
        searchRef.current?.focus();
      }

      if (e.key === "n" &&
        !modalOpen &&
        !detailsTask &&
        !exportModalOpen &&
        !importModalOpen) {
        e.preventDefault();
        openCreateModal();
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [modalOpen, detailsTask, exportModalOpen, importModalOpen, openCreateModal]);

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSaveTask = async (data: NewTask) => {
    if (!userProfile) return;
    if (editingTask) {
      await updateTask(userProfile.uid, editingTask, data);
      showToast("Task updated");
    } else {
      await createTask(userProfile.uid, data);
      showToast("Task created");
    }
  };

  const handleEditFromDetails = () => {
    if (!detailsTask) return;
    const task = detailsTask;
    setDetailsTask(null);
    openEditModal(task);
  };

  const handleDeleteFromDetails = async () => {
    if (!detailsTask || !userProfile) return;
    await deleteTask(userProfile.uid, detailsTask.id);
    showToast("Task deleted");
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
      showToast(
        currentStatus === "done"
          ? "Task moved back to to do"
          : "Task completed",
      );
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Couldn't update task. Try again."));
    }
  };

  const filteredTasks = useMemo(() => {
    const base = sort === "newest" ? tasks : tasksByDue;
    return base?.filter((task) => {
      const matchedQuery = task.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchedPriority = priority === "all" || task.priority === priority;
      const matchedStatus = status === "all" || task.status === status;
      return matchedQuery && matchedPriority && matchedStatus;
    });
  }, [tasks, tasksByDue, sort, searchQuery, priority, status]);

  const handleExportData = () => {
    const data = exportScope === "all" ? tasks : filteredTasks;

    if (exportFormat === "json") {
      const json = JSON.stringify(data, null, 2);
      downloadFile(json, "tasks.json", "application/json");
      return;
    }

    if (exportFormat === "csv") {
      const csv = buildCsv(data);

      downloadFile(csv, "tasks.csv", "text/csv;charset=utf-8");
    }

    showToast(`Exported ${data.length} task${data.length === 1 ? "" : "s"}`);
  };

  const buildCsv = (tasks: Task[]) => {
    const headers = [
      "Title",
      "Description",
      "Status",
      "Priority",
      "Due Date",
      "Created At",
      "Updated At",
      "Completed At",
    ];

    const rows = tasks.map((task) => [
      task.title,
      task.description,
      task.status,
      task.priority,
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "",
      new Date(task.createdAt).toLocaleString(),
      new Date(task.updatedAt).toLocaleString(),
      task.completedAt ? new Date(task.completedAt).toLocaleString() : "",
    ]);

    return [headers, ...rows]
      .map((row) => row.map(escapeCsvValue).join(","))
      .join("\n");
  };
  const escapeCsvValue = (value: unknown): string => {
    if (value == null) return "";

    const str = String(value);

    if (/[",\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }

    return str;
  };

  const downloadFile = (
    content: string,
    fileName: string,
    mimeType: string,
  ) => {
    const blob = new Blob([content], { type: mimeType });

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = fileName;
    a.click();

    URL.revokeObjectURL(url);

    setExportModalOpen(false);
  };
  //drag and drop
  const [dragOverColumn, setDragOverColumn] = useState<TaskStatus | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    setDraggingId(null);
    setDragOverColumn(null);
    const taskId = e.dataTransfer.getData("text/plain");
    const task = tasks.find((t) => t.id === taskId);
    if (!task || !userProfile || task.status === newStatus) return;

    try {
      await updateTask(userProfile.uid, task, { ...task, status: newStatus });
      showToast(`Moved to ${columns.find((c) => c.key === newStatus)?.label}`);
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Couldn't move task. Try again."));
    }
  };
  return (
    <div className="max-w-5xl min-h-screen mx-auto px-6 sm:px-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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

          <Button onClick={openCreateModal}>
            <Plus className="h-4 w-4" />
            New task
          </Button>
        </div>
      </div>

      {/* search and filter bar */}
      <div className="mt-6 flex flex-wrap items-center gap-3">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            ref={searchRef}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search tasks"
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-orange-500"
          />
        </div>

        {/* Priority filter */}
        <select
          value={priority}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            if (e.target.value === "all") {
              next.delete("priority");
            } else {
              next.set("priority", e.target.value);
            }

            setSearchParams(next);
          }}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500"
        >
          <option value="all">All priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
          <option value="urgent">Urgent</option>
        </select>

        {/* status filter */}
        <select
          value={status}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            if (e.target.value === "all") {
              next.delete("status");
            } else {
              next.set("status", e.target.value);
            }

            setSearchParams(next);
          }}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500"
        >
          <option value="all">All status</option>
          <option value="todo">Todo</option>
          <option value="in_progress">In progress</option>
          <option value="done">Done</option>
        </select>

        {/* Sort */}
        <select
          value={sort}
          onChange={(e) => {
            const next = new URLSearchParams(searchParams);
            next.set("sort", e.target.value);
            setSearchParams(next);
          }}
          className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-orange-500"
        >
          <option value="newest">Newest first</option>
          <option value="dueDate">Due date</option>
        </select>

        {/* Export */}
        <Button variant="outline" onClick={() => setExportModalOpen(true)}>
          <Download className="h-4 w-4" />
          Export
        </Button>

        {/* Import */}
        <Button variant="outline" onClick={openImportModal}>
          <Upload className="h-4 w-4" />
          Import
        </Button>
      </div>
      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {tasksStatus === "loading" || tasksStatus === "idle" ? (
        <div className="mt-6 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3.5">
              <div className="h-4 w-4 rounded-full bg-slate-200 animate-pulse" />
              <div className="h-4 flex-1 rounded bg-slate-200 animate-pulse" />
              <div className="h-4 w-20 rounded-full bg-slate-200 animate-pulse" />
            </div>
          ))}
        </div>
      ) : (
        <div className="min-h-screen">
          {/* List view */}
          {view === "list" && (
            <div className="mt-6 bg-white border border-slate-200 rounded-xl divide-y divide-slate-100">
              {filteredTasks.map((task) => {
                let dueLabel;
                if (task.dueDate) {
                  dueLabel = getDueLabel(task.dueDate);
                }
                const overdue = isOverdue(task);
                return (
                  <div
                    key={task.id}
                    onClick={() => setDetailsTask(task)}
                    className="flex items-center gap-3 px-4 py-3 cursor-pointer hover:bg-slate-50 transition-colors"
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
              {filteredTasks.length === 0 &&
                (tasks.length === 0 ? (
                  <div className="px-4 py-12 text-center">
                    <p className="text-sm text-slate-400">No tasks yet.</p>
                    <button
                      onClick={openCreateModal}
                      className="mt-2 text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                      Add your first task
                    </button>
                  </div>
                ) : (
                  <div className="px-4 py-12 text-center">
                    <p className="text-sm text-slate-400">
                      No tasks match your filters.
                    </p>
                    <button
                      onClick={() => {
                        setSearchQuery("");
                        setSearchParams({});
                      }}
                      className="mt-2 text-sm font-medium text-orange-600 hover:text-orange-700"
                    >
                      Clear filters
                    </button>
                  </div>
                ))}
            </div>
          )}

          {/* Kanban view */}
          {view === "kanban" && (
            <div className="mt-6 grid sm:grid-cols-3 gap-4">
              {columns.map((col) => {
                const colTasks = filteredTasks.filter(
                  (t) => t.status === col.key,
                );
                const draggingTask = tasks.find((t) => t.id === draggingId);
                const isOriginalColumn = draggingTask?.status === col.key;
                return (
                  <div
                    key={col.key}
                    onDragOver={(e) => {
                      e.preventDefault();
                      if (isOriginalColumn) return;
                      if (dragOverColumn !== col.key) {
                        setDragOverColumn(col.key);
                      }
                    }}
                    onDragLeave={(e) => {
                      // Only reset if leaving the column wrapper completely
                      const rect = e.currentTarget.getBoundingClientRect();
                      const isLeaving =
                        e.clientX < rect.left ||
                        e.clientX >= rect.right ||
                        e.clientY < rect.top ||
                        e.clientY >= rect.bottom;

                      if (isLeaving) {
                        setDragOverColumn(null);
                      }
                    }}
                    onDrop={(e) => {
                      setDragOverColumn(null);
                      handleDrop(e, col.key);
                    }}
                    className={`rounded-xl p-3 min-h-[500px] transition-colors ${
                      dragOverColumn === col.key
                        ? "bg-orange-50/80 border border-dashed border-orange-300 dark:bg-slate-50"
                        : "bg-slate-100/60 border border-transparent"
                    }`}
                  >
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
                        let dueLabel;
                        if (task.dueDate) {
                          dueLabel = getDueLabel(task.dueDate);
                        }
                        const overdue = isOverdue(task);
                        return (
                          <div
                            key={task.id}
                            draggable
                            onDragStart={(e) => {
                              e.dataTransfer.setData("text/plain", task.id);
                              setDraggingId(task.id);
                              e.dataTransfer.effectAllowed = "move";
                            }}
                            onDragEnd={() => {
                              setDraggingId(null);
                              setDragOverColumn(null);
                            }}
                            onClick={() => setDetailsTask(task)}
                            className={`bg-white border border-slate-200 rounded-lg px-3 py-2.5 cursor-grab active:cursor-grabbing hover:border-slate-300 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift ${
                              draggingId === task.id
                                ? "opacity-20 scale-95"
                                : ""
                            } `}
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
        </div>
      )}

      <Modal
        open={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
        title="Export tasks"
        titleId="export-modal-title"
        maxWidth="max-w-sm"
        closeOnBackdrop
      >
        <div>
          <p className="text-sm font-medium text-slate-700 mb-2">Scope</p>
          <label className="flex items-center gap-2 mb-2 cursor-pointer">
            <input
              type="radio"
              name="scope"
              value="current"
              checked={exportScope === "current"}
              onChange={() => setExportScope("current")}
              className="text-orange-600"
            />
            <span className="text-sm text-slate-700">Current view</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="scope"
              value="all"
              checked={exportScope === "all"}
              onChange={() => setExportScope("all")}
              className="text-orange-600"
            />
            <span className="text-sm text-slate-700">All tasks</span>
          </label>
        </div>

        <div className="mt-4">
          <p className="text-sm font-medium text-slate-700 mb-2">Format</p>
          <label className="flex items-center gap-2 mb-2 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="json"
              checked={exportFormat === "json"}
              onChange={() => setExportFormat("json")}
              className="text-orange-600"
            />
            <span className="text-sm text-slate-700">JSON</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="radio"
              name="format"
              value="csv"
              checked={exportFormat === "csv"}
              onChange={() => setExportFormat("csv")}
              className="text-orange-600"
            />
            <span className="text-sm text-slate-700">CSV</span>
          </label>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setExportModalOpen(false)}
          >
            Cancel
          </Button>
          <Button onClick={handleExportData}>Export</Button>
        </div>
      </Modal>

      <Modal
        open={importModalOpen}
        onClose={() => setImportModalOpen(false)}
        title="Import tasks from JSON"
        titleId="import-modal-title"
        maxWidth="max-w-sm"
        description="Choose a JSON file of tasks. New tasks are added to your existing list."
        closeOnBackdrop
      >
        <input
          ref={importFileRef}
          type="file"
          accept=".json,application/json"
          className="hidden"
          onChange={(e) => {
            setImportMessage(null);
            setImportFile(e.target.files?.[0] ?? null);
          }}
        />

        <button
          onClick={() => importFileRef.current?.click()}
          className="mt-1 w-full flex flex-col items-center justify-center gap-2 px-4 py-8 border-2 border-dashed border-slate-200 rounded-lg hover:border-orange-400 transition-colors"
        >
          <Upload className="h-6 w-6 text-slate-400" />
          <span className="text-sm text-slate-600">
            {importFile ? importFile.name : "Choose a JSON file"}
          </span>
        </button>

        {importMessage && (
          <p
            className={`mt-4 text-sm ${
              importMessage.isError ? "text-red-600" : "text-emerald-600"
            }`}
          >
            {importMessage.text}
          </p>
        )}

        <div className="mt-6 flex items-center justify-end gap-3">
          <Button
            variant="outline"
            onClick={() => setImportModalOpen(false)}
          >
            Close
          </Button>
          <Button
            onClick={handleImport}
            loading={importLoading}
            disabled={!importFile}
          >
            Import
          </Button>
        </div>
      </Modal>

      <TaskModal
        open={modalOpen}
        onClose={closeModal}
        onSave={handleSaveTask}
        initialTask={editingTask}
      />
      <TaskDetailsModal
        open={detailsTask !== null}
        task={detailsTask}
        onClose={() => setDetailsTask(null)}
        onEdit={handleEditFromDetails}
        onDelete={handleDeleteFromDetails}
      />
    </div>
  );
}
