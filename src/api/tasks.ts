import {
  onValue,
  ref,
  push,
  set,
  update,
  remove,
  type Unsubscribe,
} from "firebase/database";
import type { NewTask, TaskScope } from "../types/task";
import { db } from "../utils/firebaseConfig";
import type { Task } from "../types/task";

type TaskScopeInput = string | TaskScope;

export const personalTaskScope = (uid: string): TaskScope => ({
  type: "personal",
  id: uid,
});

export const workspaceTaskScope = (workspaceId: string): TaskScope => ({
  type: "workspace",
  id: workspaceId,
});

export function getTaskScopeKey(scope: TaskScope): string {
  return `${scope.type}:${scope.id}`;
}

function resolveTaskPath(scope: TaskScopeInput): string {
  if (typeof scope === "string") return `tasks/${scope}`;
  return scope.type === "workspace"
    ? `workspaceTasks/${scope.id}`
    : `tasks/${scope.id}`;
}

//subscribe to realtime task updates
export function subscribeToTasks(
  scope: TaskScopeInput,
  onData: (tasks: Record<string, Task>) => void,
  onError: (message: string) => void,
): Unsubscribe {
  return onValue(
    ref(db, resolveTaskPath(scope)),
    (snapshot) => {
      onData(snapshot.val() || {});
    },
    (err) => {
      onError(err.message);
    },
  );
}

//create a task
export const createTask = (
  scope: TaskScopeInput,
  task: NewTask,
  createdBy?: string,
) => {
  const newTaskRef = push(ref(db, resolveTaskPath(scope)));
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
    assigneeId: task.assigneeId ?? null,
    assigneeName: task.assigneeName ?? null,
    ...(createdBy ? { createdBy } : {}),
    ...(typeof scope !== "string" && scope.type === "workspace"
      ? { workspaceId: scope.id }
      : {}),
  };
  return set(newTaskRef, fullTask);
};

//update a task  and look for status change to register completion date
export async function updateTask(
  scope: TaskScopeInput,
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

  return update(ref(db, `${resolveTaskPath(scope)}/${task.id}`), updates);
}

//import multiple tasks at once
export function importTasks(
  scope: TaskScopeInput,
  tasks: NewTask[],
  createdBy?: string,
) {
  return Promise.all(tasks.map((task) => createTask(scope, task, createdBy)));
}

//delete a task
export function deleteTask(scope: TaskScopeInput, taskId: string) {
  return remove(ref(db, `${resolveTaskPath(scope)}/${taskId}`));
}
