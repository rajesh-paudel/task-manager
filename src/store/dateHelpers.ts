import type { Task } from "../types/task";

const startOfDay = (d: Date) =>
  new Date(d.getFullYear(), d.getMonth(), d.getDate());

/** Turns a dueDate timestamp into a short relative label, or null if unset. */
export function getDueLabel(dueDate: number | null): string | null {
  if (dueDate === null) return null;

  const today = startOfDay(new Date());
  const due = startOfDay(new Date(dueDate));
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays === 0) return "Today";
  if (diffDays === 1) return "Tomorrow";
  if (diffDays < 0) return "Overdue";
  if (diffDays <= 6)
    return new Date(dueDate).toLocaleDateString(undefined, {
      weekday: "short",
    });
  return new Date(dueDate).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function isOverdue(task: Task): boolean {
  return (
    task.status !== "done" && task.dueDate !== null && task.dueDate < Date.now()
  );
}

/** Buckets completed tasks into the last 7 calendar days (including today). */
export function getWeeklyCompletionCounts(tasks: Task[]) {
  const today = startOfDay(new Date());

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(date.getDate() - (6 - i));
    return {
      day: date.toLocaleDateString(undefined, { weekday: "short" }),
      time: date.getTime(),
      completed: 0,
    };
  });

  for (const task of tasks) {
    if (task.status !== "done" || task.completedAt === null) continue;
    const completedDay = startOfDay(new Date(task.completedAt)).getTime();
    const bucket = days.find((d) => d.time === completedDay);
    if (bucket) bucket.completed += 1;
  }

  return days.map(({ day, completed }) => ({ day, completed }));
}
