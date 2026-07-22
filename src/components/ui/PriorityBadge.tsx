import type { TaskPriority } from "../../types/task";

const styles: Record<TaskPriority, string> = {
  low: "bg-slate-100 text-slate-600",
  medium: "bg-blue-50 text-blue-600",
  high: "bg-violet-50 text-violet-600",
  urgent: "bg-red-50 text-red-600",
};

const labels: Record<TaskPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
  urgent: "Urgent",
};

export default function PriorityBadge({
  priority,
}: {
  priority: TaskPriority;
}) {
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-medium shrink-0 ${styles[priority]}`}
    >
      {labels[priority]}
    </span>
  );
}
