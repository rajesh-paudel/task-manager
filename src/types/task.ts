export type TaskStatus = "todo" | "in_progress" | "done";
export type TaskPriority = "low" | "medium" | "high" | "urgent";

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: number | null;

  createdAt: number;
  updatedAt: number;
  completedAt: number | null;
}
export type NewTask = Pick<
  Task,
  "title" | "description" | "status" | "priority" | "dueDate"
>;
