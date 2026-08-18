import {
  onValue,
  ref,
  push,
  set,
  update,
  remove,
  type Unsubscribe,
} from "firebase/database";
import type { NewTask } from "../types/task";
import { db } from "../utils/firebaseConfig";
import type { Task } from "../types/task";

//subscribe to realtime task updates
export function subscribeToTasks(
  uid: string,
  onData: (tasks: Record<string, Task>) => void,
  onError: (message: string) => void,
): Unsubscribe {
  return onValue(
    ref(db, `/tasks/${uid}`),
    (snapshot) => {
      onData(snapshot.val() || {});
    },
    (err) => {
      onError(err.message);
    },
  );
}

//create a task
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

//update a task  and look for status change to register completion date
export async function updateTask(
  uid: string,
  task: Task,
  changes: Partial<Task>,
) {
  const updates: Partial<Task> = {
    ...changes,
    updatedAt: Date.now(),
  };

  //look for status change
  if (changes.status !== undefined && changes.status !== task.status) {
    if (changes.status === "done") {
      updates.completedAt = Date.now();
    } else {
      updates.completedAt = null;
    }
  }

  return update(ref(db, `tasks/${uid}/${task.id}`), updates);
}

//import multiple tasks at once
export function importTasks(uid: string, tasks: NewTask[]) {
  return Promise.all(tasks.map((task) => createTask(uid, task)));
}

//delete a task
export function deleteTask(uid: string, taskId: string) {
  return remove(ref(db, `tasks/${uid}/${taskId}`));
}
