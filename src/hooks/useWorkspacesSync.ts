import { useEffect } from "react";
import {
  fetchWorkspacesByIds,
  subscribeToUserWorkspaces,
  subscribeToWorkspaceMembers,
} from "../api/workspaces";
import {
  workspaceDetailsReceived,
  workspaceMembersReceived,
  workspacesCleared,
  workspacesError,
  workspacesLoading,
  userWorkspacesReceived,
} from "../store/workspaceSlice";
import { useAppDispatch, useAppSelector } from "../store/store";

export const useWorkspacesSync = (uid: string | undefined) => {
  const dispatch = useAppDispatch();
  const activeWorkspaceId = useAppSelector(
    (state) => state.workspaces.activeWorkspaceId,
  );

  useEffect(() => {
    if (!uid) {
      dispatch(workspacesCleared());
      return;
    }

    let isActive = true;
    dispatch(workspacesLoading());
    const unsubscribe = subscribeToUserWorkspaces(
      uid,
      (userWorkspaces) => {
        dispatch(userWorkspacesReceived(userWorkspaces));
        fetchWorkspacesByIds(Object.keys(userWorkspaces))
          .then((workspaces) => {
            if (isActive) {
              dispatch(workspaceDetailsReceived(workspaces));
            }
          })
          .catch((error: unknown) => {
            if (error instanceof Error) {
              dispatch(workspacesError(error.message));
            } else {
              dispatch(workspacesError("Unable to load workspaces."));
            }
          });
      },
      (message) => dispatch(workspacesError(message)),
    );

    return () => {
      isActive = false;
      unsubscribe();
    };
  }, [uid, dispatch]);

  useEffect(() => {
    if (!activeWorkspaceId) {
      return;
    }

    const unsubscribe = subscribeToWorkspaceMembers(
      activeWorkspaceId,
      (members) =>
        dispatch(
          workspaceMembersReceived({ workspaceId: activeWorkspaceId, members }),
        ),
      (message) => dispatch(workspacesError(message)),
    );

    return () => unsubscribe();
  }, [activeWorkspaceId, dispatch]);
};
