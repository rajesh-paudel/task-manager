import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
  UserWorkspace,
  Workspace,
  WorkspaceMember,
} from "../types/workspace";

interface WorkspaceState {
  userWorkspaces: Record<string, UserWorkspace>;
  workspaces: Record<string, Workspace>;
  members: Record<string, Record<string, WorkspaceMember>>;
  activeWorkspaceId: string | null;
  status: "idle" | "loading" | "synced" | "error";
  error: string | null;
}

const initialState: WorkspaceState = {
  userWorkspaces: {},
  workspaces: {},
  members: {},
  activeWorkspaceId: null,
  status: "idle",
  error: null,
};

const workspaceSlice = createSlice({
  name: "workspaces",
  initialState,
  reducers: {
    workspacesLoading(state) {
      state.status = "loading";
    },
    userWorkspacesReceived(
      state,
      action: PayloadAction<Record<string, UserWorkspace>>,
    ) {
      state.userWorkspaces = action.payload;
      state.status = "synced";
      state.error = null;

      const workspaceIds = Object.keys(action.payload);
      if (
        state.activeWorkspaceId &&
        !workspaceIds.includes(state.activeWorkspaceId)
      ) {
        state.activeWorkspaceId = null;
      }
    },
    workspaceDetailsReceived(
      state,
      action: PayloadAction<Record<string, Workspace>>,
    ) {
      state.workspaces = { ...state.workspaces, ...action.payload };
    },
    workspaceCreated(
      state,
      action: PayloadAction<{
        workspace: Workspace;
        member: WorkspaceMember;
        userWorkspace: UserWorkspace;
      }>,
    ) {
      const { workspace, member, userWorkspace } = action.payload;
      state.workspaces[workspace.id] = workspace;
      state.members[workspace.id] = {
        ...(state.members[workspace.id] ?? {}),
        [member.uid]: member,
      };
      state.userWorkspaces[workspace.id] = userWorkspace;
      state.activeWorkspaceId = workspace.id;
      state.status = "synced";
      state.error = null;
    },
    workspaceMembersReceived(
      state,
      action: PayloadAction<{
        workspaceId: string;
        members: Record<string, WorkspaceMember>;
      }>,
    ) {
      state.members[action.payload.workspaceId] = action.payload.members;
    },
    activeWorkspaceChanged(state, action: PayloadAction<string | null>) {
      state.activeWorkspaceId = action.payload;
    },
    workspacesError(state, action: PayloadAction<string>) {
      state.status = "error";
      state.error = action.payload;
    },
    workspacesCleared(state) {
      state.userWorkspaces = {};
      state.workspaces = {};
      state.members = {};
      state.activeWorkspaceId = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const {
  activeWorkspaceChanged,
  workspaceCreated,
  workspaceDetailsReceived,
  workspaceMembersReceived,
  workspacesCleared,
  workspacesError,
  workspacesLoading,
  userWorkspacesReceived,
} = workspaceSlice.actions;
export default workspaceSlice.reducer;
