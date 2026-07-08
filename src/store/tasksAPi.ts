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
    completedAt: null,
  };

  return set(newTaskRef, fullTask);
};
export function updateTask(
  uid: string,
  taskId: string,
  changes: Partial<Task>,
) {
  return update(ref(db, `tasks/${uid}/${taskId}`), {
    ...changes,
    updatedAt: Date.now(),
  });
}

export function setTaskStatus(
  uid: string,
  taskId: string,
  status: Task["status"],
) {
  return updateTask(uid, taskId, {
    status,
    completedAt: status === "done" ? Date.now() : null,
  });
}

export function deleteTask(uid: string, taskId: string) {
  return remove(ref(db, `tasks/${uid}/${taskId}`));
}
