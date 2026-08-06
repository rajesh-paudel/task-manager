import type { NewTask, TaskPriority, TaskStatus } from "../types/task";

const validStatuses: TaskStatus[] = ["todo", "in_progress", "done"];
const validPriorities: TaskPriority[] = ["low", "medium", "high", "urgent"];

function parseDueDate(value: unknown): number | null {
  if (value === null || value === undefined || value === "") return null;
  if (typeof value === "number" && Number.isFinite(value)) return value;
  if (typeof value === "string") {
    const timestamp = Date.parse(value);
    if (!Number.isNaN(timestamp)) return timestamp;
  }
  return null;
}

function sanitizeEntry(entry: unknown): NewTask | null {
  if (typeof entry !== "object" || entry === null) return null;
  const record = entry as Record<string, unknown>;

  if (typeof record.title !== "string" || record.title.trim() === "") {
    return null;
  }

  const status = record.status as TaskStatus;
  if (!validStatuses.includes(status)) return null;

  const priority = record.priority as TaskPriority;
  if (!validPriorities.includes(priority)) return null;

  return {
    title: record.title.trim(),
    description:
      typeof record.description === "string" ? record.description : "",
    status,
    priority,
    dueDate: parseDueDate(record.dueDate),
  };
}

export function parseTasksJson(content: string): {
  tasks: NewTask[];
  skipped: number;
} {
  let parsed: unknown;
  try {
    parsed = JSON.parse(content);
  } catch {
    throw new Error("Invalid JSON file.");
  }

  if (!Array.isArray(parsed)) {
    throw new Error("JSON must be an array of tasks.");
  }

  const tasks: NewTask[] = [];
  let skipped = 0;

  for (const entry of parsed) {
    const task = sanitizeEntry(entry);
    if (task) {
      tasks.push(task);
    } else {
      skipped += 1;
    }
  }

  return { tasks, skipped };
}
