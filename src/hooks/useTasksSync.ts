import { useEffect } from "react";
import { useAppDispatch } from "../store/store";
import {
  tasksLoading,
  tasksCleared,
  tasksError,
  tasksReceived,
} from "../store/taskSlice";
import {
  getTaskScopeKey,
  personalTaskScope,
  subscribeToTasks,
  workspaceTaskScope,
} from "../api/tasks";

export const useTasksSync = (
  uid: string | undefined,
  workspaceId: string | null,
) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!uid) {
      dispatch(tasksCleared());
      return;
    }
    const taskScope = workspaceId
      ? workspaceTaskScope(workspaceId)
      : personalTaskScope(uid);
    const sourceKey = getTaskScopeKey(taskScope);

    dispatch(tasksLoading(sourceKey));
    const unsubscribe = subscribeToTasks(
      taskScope,
      (tasks) => dispatch(tasksReceived({ items: tasks, sourceKey })),
      (message) => dispatch(tasksError(message)),
    );
    return () => unsubscribe();
  }, [uid, workspaceId, dispatch]);
};
