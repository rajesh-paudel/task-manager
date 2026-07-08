import { useEffect, useState } from "react";
import { X, Loader2, Trash2 } from "lucide-react";

import type { NewTask, Task, TaskPriority, TaskStatus } from "../types/task";
interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewTask) => Promise<void>;
  onDelete?: () => Promise<void>;
  initialTask?: Task | null;
}

const statusOptions: { value: TaskStatus; label: string }[] = [
  { value: "todo", label: "To do" },
  { value: "in_progress", label: "In progress" },
  { value: "done", label: "Done" },
];

const priorityOptions: { value: TaskPriority; label: string; dot: string }[] = [
  { value: "low", label: "Low", dot: "bg-slate-400" },
  { value: "medium", label: "Medium", dot: "bg-blue-500" },
  { value: "high", label: "High", dot: "bg-violet-500" },
  { value: "urgent", label: "Urgent", dot: "bg-red-500" },
];

// <input type="date"> works in local calendar days, not UTC timestamps —
// these two convert between that and the epoch-ms values Task stores.
function toDateInputValue(timestamp: number | null): string {
  if (timestamp === null) return "";
  const d = new Date(timestamp);
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60_000);
  return local.toISOString().slice(0, 10);
}

function fromDateInputValue(value: string): number | null {
  if (!value) return null;
  return new Date(`${value}T00:00:00`).getTime();
}

export default function TaskModal({
  open,
  onClose,
  onSave,
  onDelete,
  initialTask,
}: TaskModalProps) {
  const isEditing = !!initialTask;

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [dueDate, setDueDate] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  // Reset the form whenever the modal opens, or swaps between editing
  // different tasks.
  useEffect(() => {
    if (!open) return;
    setTitle(initialTask?.title ?? "");
    setDescription(initialTask?.description ?? "");
    setStatus(initialTask?.status ?? "todo");
    setPriority(initialTask?.priority ?? "medium");
    setDueDate(toDateInputValue(initialTask?.dueDate ?? null));
    setError("");
  }, [open, initialTask]);

  if (!open) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError("Title can't be empty.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSave({
        title: title.trim(),
        description: description.trim(),
        status,
        priority,
        dueDate: fromDateInputValue(dueDate),
      });
      onClose();
    } catch (err: any) {
      setError(err.message || "Couldn't save task. Try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    setDeleting(true);
    setError("");
    try {
      await onDelete();
      onClose();
    } catch (err: any) {
      setError(err.message || "Couldn't delete task. Try again.");
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            {isEditing ? "Edit task" : "New task"}
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {error && (
          <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title
            </label>
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task title"
              className="w-full px-0 py-2 border-0 border-b border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 bg-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details"
              className="w-full px-0 py-2 border-0 border-b border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 bg-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Status
            </label>
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg p-1">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setStatus(opt.value)}
                  className={`flex-1 text-xs font-medium py-1.5 rounded-md ${
                    status === opt.value
                      ? "bg-white text-orange-600 shadow-sm"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Priority
            </label>
            <div className="grid grid-cols-4 gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setPriority(opt.value)}
                  className={`flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg border ${
                    priority === opt.value
                      ? "border-orange-600 text-orange-600 bg-orange-50"
                      : "border-slate-200 text-slate-500 hover:border-slate-300"
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${opt.dot}`} />
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Due date
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-orange-500"
            />
          </div>

          <div className="flex items-center gap-3 pt-2">
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || saving}
                className="mr-auto h-9 w-9 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 disabled:opacity-50"
                aria-label="Delete task"
              >
                {deleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </button>
            )}
            <button
              type="button"
              onClick={onClose}
              disabled={saving || deleting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving || deleting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : isEditing
                  ? "Save changes"
                  : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
