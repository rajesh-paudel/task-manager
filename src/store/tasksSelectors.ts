import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "./store";
import type { Task, TaskStatus } from "../types/task";
const selectTasksItems = (state: RootState) => state.tasks.items;

export const selectAllTasks = createSelector(selectTasksItems, (items) =>
  Object.values(items).sort((a, b) => b.createdAt - a.createdAt),
);

// Tasks with no due date sort to the end, regardless of direction.
export const selectTasksByDueDate = createSelector(selectAllTasks, (tasks) =>
  [...tasks].sort((a, b) => {
    if (a.dueDate == null && b.dueDate == null) return 0;
    if (a.dueDate == null) return 1;
    if (b.dueDate == null) return -1;
    const diff = a.dueDate - b.dueDate;
    if (diff !== 0) return diff;
    return b.createdAt - a.createdAt;
  }),
);

export const selectTasksByStatus = (status: TaskStatus) =>
  createSelector(selectAllTasks, (tasks) =>
    tasks.filter((t) => t.status === status),
  );

export const selectOverdueTasks = createSelector(selectAllTasks, (tasks) => {
  const now = Date.now();
  return tasks.filter(
    (t) => t.status !== "done" && t.dueDate != null && t.dueDate < now,
  );
});

export const selectTaskStats = createSelector(
  selectAllTasks,
  selectOverdueTasks,
  (tasks, overdue) => ({
    total: tasks.length,
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in_progress").length,
    done: tasks.filter((t) => t.status === "done").length,
    overdue: overdue.length,
  }),
);

export const selectTaskById = (id: string) =>
  createSelector(
    selectTasksItems,
    (items): Task | undefined => items[id],
  );
