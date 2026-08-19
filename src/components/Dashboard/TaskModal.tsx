import { useEffect, useState } from "react";

import type { NewTask, Task, TaskPriority, TaskStatus } from "../../types/task";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
import Modal from "../ui/Modal";
import Input from "../ui/Input";
import Textarea from "../ui/Textarea";
import Button from "../ui/Button";
interface TaskModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: NewTask) => Promise<void>;
  initialTask?: Task | null;
  defaultDueDate?: number | null;
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
  const local = new Date(d.getTime() - d.getTimezoneOffset() * 60000);
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
  initialTask,
  defaultDueDate,
}: TaskModalProps) {
  const isEditing = !!initialTask;

  const {
    register,
    handleSubmit,
    reset,
    control,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<TaskForm>({
    resolver: zodResolver(taskSchema),

    defaultValues: {
      title: "",
      description: "",
      status: "todo",
      priority: "low",
      dueDate: "",
    },
  });
  const status = useWatch({ control, name: "status" });
  const priority = useWatch({ control, name: "priority" });
  const [error, setError] = useState("");

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
        dueDate: toDateInputValue(defaultDueDate ?? null),
      });
    }

    const timer = setTimeout(() => setError(""), 0);
    return () => clearTimeout(timer);
  }, [open, initialTask, defaultDueDate, reset]);

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
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Couldn't save task. Try again.",
      );
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Edit task" : "New task"}
      titleId="task-modal-title"
    >
      {error && (
        <div className="mb-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(handleSave)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1.5">
            Title
          </label>
          <Input
            autoFocus
            invalid={!!errors.title}
            {...register("title")}
            placeholder="Task title"
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
          <Textarea
            rows={3}
            invalid={!!errors.description}
            {...register("description")}
            placeholder="Optional details"
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
                className={`flex-1 text-xs font-medium py-1.5 rounded-md transition-colors ${
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
                className={`flex items-center justify-center gap-1.5 text-xs font-medium py-1.5 rounded-lg border transition-colors ${
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
          <Input
            type="date"
            invalid={!!errors.dueDate}
            {...register("dueDate")}
          />
          {errors.dueDate && (
            <p className="mt-1 text-sm text-red-500">
              {errors.dueDate.message}
            </p>
          )}
        </div>

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button type="submit" loading={isSubmitting}>
            {isSubmitting
              ? "Saving..."
              : isEditing
                ? "Save changes"
                : "Create task"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
