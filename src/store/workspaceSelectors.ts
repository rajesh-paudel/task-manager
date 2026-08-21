import type { RootState } from "./store";
import type { Workspace } from "../types/workspace";

export const selectWorkspaceStatus = (state: RootState) =>
  state.workspaces.status;

export const selectWorkspaceError = (state: RootState) =>
  state.workspaces.error;

export const selectActiveWorkspaceId = (state: RootState) =>
  state.workspaces.activeWorkspaceId;

export const selectAllWorkspaces = (state: RootState): Workspace[] =>
  Object.values(state.workspaces.workspaces).sort(
    (a, b) => b.updatedAt - a.updatedAt,
  );

export const selectActiveWorkspace = (state: RootState) => {
  const activeWorkspaceId = selectActiveWorkspaceId(state);
  return activeWorkspaceId
    ? state.workspaces.workspaces[activeWorkspaceId]
    : undefined;
};

export const selectActiveWorkspaceMembers = (state: RootState) => {
  const activeWorkspaceId = selectActiveWorkspaceId(state);
  return activeWorkspaceId
    ? Object.values(state.workspaces.members[activeWorkspaceId] || {})
    : [];
};
