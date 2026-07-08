import { useEffect } from "react";
import { useAppDispatch } from "./store";
import {
  tasksLoading,
  tasksCleared,
  tasksError,
  tasksReceived,
} from "./taskSlice";
import { db } from "../utils/firebaseConfig";
import { onValue, ref } from "firebase/database";

export const useTasksSync = (uid: string | undefined) => {
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!uid) {
      dispatch(tasksCleared());
      return;
    }
    dispatch(tasksLoading());
    const taskRef = ref(db, `/tasks/${uid}`);
    const unsubscribe = onValue(
      taskRef,
      (snapshot) => {
        dispatch(tasksReceived(snapshot.val() || {}));
      },
      (err) => {
        dispatch(tasksError(err.message));
      },
    );
    return () => unsubscribe();
  }, [uid, dispatch]);
};
