import { useEffect, useState } from "react";
import { X, Loader2, Trash2 } from "lucide-react";

import type { NewTask, Task, TaskPriority, TaskStatus } from "../../types/task";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const taskSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Title is required")
    .max(100, "Title is too long."),
  description: z.string().trim().optional(),
  status: z.enum(["todo", "in_progress", "done"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  dueDate: z.string(),
});

type TaskForm = z.infer<typeof taskSchema>;

export default function TaskModal({
  open,
  onClose,
  onSave,
  onDelete,
  initialTask,
}: TaskModalProps) {
  const isEditing = !!initialTask;

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),
    mode: "onTouched",
    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "low",
      dueDate: "",
    },
  });
  const status = watch("status");
  const priority = watch("priority");
  useEffect(() => {
    if (!open) return;

    if (initialTask) {
      reset({
        title: initialTask.title,
        description: initialTask.description,
        status: initialTask.status,
        priority: initialTask.priority,
        dueDate: toDateInputValue(initialTask?.dueDate ?? null),
      });
    } else {
      reset({
        title: "",
        description: "",
        status: "todo",
        priority: "medium",
        dueDate: "",
      });
    }

    setError("");
  }, [open, initialTask, reset]);

  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!open) return null;

  const handleSave = async (data: TaskForm) => {
    setError("");
    try {
      const newTask: NewTask = {
        title: data.title,
        description: data.description,
        status: data.status,
        priority: data.priority,
        dueDate: fromDateInputValue(data.dueDate),
      };

      await onSave(newTask);
      reset();
      onClose();
    } catch (err: any) {
      setError(err.message || "Couldn't save task. Try again.");
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
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center overflow-y-auto bg-slate-900/40 px-4 py-6 sm:py-4">
      <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-5 sm:p-6 max-h-[90vh] overflow-y-auto">
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

        <form onSubmit={handleSubmit(handleSave)} className="mt-5 space-y-5">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Title
            </label>
            <input
              autoFocus
              {...register("title")}
              placeholder="Task title"
              className="w-full px-0 py-2 border-0 border-b border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 bg-transparent"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">
                {errors.title.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Description
            </label>
            <textarea
              rows={3}
              {...register("description")}
              placeholder="Optional details"
              className="w-full px-0 py-2 border-0 border-b border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-slate-900 bg-transparent resize-none"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-500">
                {errors.description.message}
              </p>
            )}
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
                  onClick={() => setValue("status", opt.value)}
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
            {errors.status && (
              <p className="mt-1 text-sm text-red-500">
                {errors.status.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Priority
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {priorityOptions.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setValue("priority", opt.value)}
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
            {errors.priority && (
              <p className="mt-1 text-sm text-red-500">
                {errors.priority.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">
              Due date
            </label>
            <input
              type="date"
              {...register("dueDate")}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm text-slate-900 focus:outline-none focus:border-orange-500"
            />
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-500">
                {errors.dueDate.message}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3 pt-2">
            {isEditing && onDelete && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting || isSubmitting}
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
              disabled={isSubmitting || deleting}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting || deleting}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 disabled:opacity-50"
            >
              {isSubmitting
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
