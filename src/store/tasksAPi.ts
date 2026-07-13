import { ref, push, set, update, remove } from "firebase/database";
import type { NewTask } from "../types/task";
import { db } from "../utils/firebaseConfig";
import type { Task } from "../types/task";

export const createTask = (uid: string, task: NewTask) => {
  const newTaskRef = push(ref(db, `tasks/${uid}`));
  const now = Date.now();
  const fullTask: Task = {
    id: newTaskRef.key as string,
    title: task.title,
    description: task.description ?? "",
    status: task.status,
    priority: task.priority,
    dueDate: task.dueDate ?? null,
    createdAt: now,
    updatedAt: now,
    completedAt: task.status == "done" ? Date.now() : null,
  };
  return set(newTaskRef, fullTask);
};

export async function updateTask(
  uid: string,
  task: Task,
  changes: Partial<Task>,
) {
  const updates: Partial<Task> = {
    ...changes,
    updatedAt: Date.now(),
  };

  // did the status change?
  if (changes.status !== undefined && changes.status !== task.status) {
    if (changes.status === "done") {
      updates.completedAt = Date.now();
    } else {
      updates.completedAt = null;
    }
  }

  return update(ref(db, `tasks/${uid}/${task.id}`), updates);
}

export function deleteTask(uid: string, taskId: string) {
  return remove(ref(db, `tasks/${uid}/${taskId}`));
}
