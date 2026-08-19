import { useState } from "react";
import { Pencil, Trash2, Calendar } from "lucide-react";
import type { Task, TaskStatus } from "../../types/task";
import PriorityBadge from "../ui/PriorityBadge";
import Modal from "../ui/Modal";
import Button from "../ui/Button";
import { getDueLabel, isOverdue } from "../../utils/dateHelpers";
interface TaskDetailsModalProps {
  open: boolean;
  task: Task | null;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => Promise<void>;
}

const statusStyles: Record<TaskStatus, string> = {
  todo: "bg-slate-100 text-slate-600",
  in_progress: "bg-blue-50 text-blue-600",
  done: "bg-orange-50 text-orange-600",
};

const statusLabels: Record<TaskStatus, string> = {
  todo: "To do",
  in_progress: "In progress",
  done: "Done",
};

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function TaskDetailsModal({
  open,
  task,
  onClose,
  onEdit,
  onDelete,
}: TaskDetailsModalProps) {
  const [confirmingDelete, setConfirmingDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [error, setError] = useState("");

  if (!open || !task) return null;

  const dueLabel = getDueLabel(task.dueDate);
  const overdue = isOverdue(task);

  const handleClose = () => {
    setConfirmingDelete(false);
    setDeleting(false);
    setError("");
    onClose();
  };

  const handleConfirmDelete = async () => {
    setDeleting(true);
    setError("");
    try {
      await onDelete();
      handleClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't delete task. Try again.");
      setDeleting(false);
    }
  };

  return (
    <Modal
      open={open && !!task}
      onClose={handleClose}
      title={task.title}
      titleId="task-detail-title"
    >
      {/* Status / priority / due date */}
      <div className="flex flex-wrap items-center gap-2">
        <span
          className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${statusStyles[task.status]}`}
        >
          {statusLabels[task.status]}
        </span>
        <PriorityBadge priority={task.priority} />
        <span
          className={`inline-flex items-center gap-1 text-xs ${
            overdue ? "text-red-500 font-medium" : "text-slate-400"
          }`}
        >
          <Calendar className="h-3.5 w-3.5" />
          {dueLabel ?? "No due date"}
        </span>
      </div>

      {/* Description */}
      <div className="mt-5">
        <p className="text-xs font-medium text-slate-400 uppercase tracking-wide">
          Description
        </p>
        {task.description?.trim() ? (
          <p className="mt-1.5 text-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
            {task.description}
          </p>
        ) : (
          <p className="mt-1.5 text-sm text-slate-400 italic">
            No description
          </p>
        )}
      </div>

      {/* Meta */}
      <p className="mt-5 text-xs text-slate-400">
        Created {formatDate(task.createdAt)}
        {task.updatedAt !== task.createdAt &&
          ` · Updated ${formatDate(task.updatedAt)}`}
      </p>

      {error && (
        <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {/* Footer */}
      {confirmingDelete ? (
        <div className="mt-6 pt-5 border-t border-slate-100">
          <p className="text-sm text-slate-600">
            Delete this task? This can't be undone.
          </p>
          <div className="mt-4 flex items-center justify-end gap-3">
            <Button
              variant="ghost"
              onClick={() => setConfirmingDelete(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleConfirmDelete}
              loading={deleting}
            >
              {deleting ? "Deleting..." : "Delete task"}
            </Button>
          </div>
        </div>
      ) : (
        <div className="mt-6 pt-5 border-t border-slate-100 flex items-center gap-3">
          <button
            onClick={() => setConfirmingDelete(true)}
            className="mr-auto h-9 w-9 flex items-center justify-center rounded-lg text-red-500 hover:bg-red-50 transition-colors"
            aria-label="Delete task"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <Button onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
            Edit
          </Button>
        </div>
      )}
    </Modal>
  );
}
