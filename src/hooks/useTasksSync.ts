import { useEffect } from "react";
import { useAppDispatch } from "../store/store";
import {
  tasksLoading,
  tasksCleared,
  tasksError,
  tasksReceived,
} from "../store/taskSlice";
import { subscribeToTasks } from "../api/tasks";

export const useTasksSync = (uid: string | undefined) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!uid) {
      dispatch(tasksCleared());
      return;
    }
    dispatch(tasksLoading());
    const unsubscribe = subscribeToTasks(
      uid,
      (tasks) => dispatch(tasksReceived(tasks)),
      (message) => dispatch(tasksError(message)),
    );
    return () => unsubscribe();
  }, [uid, dispatch]);
};