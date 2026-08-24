import { describe, expect, it } from "vitest";
import reducer, {
  activeWorkspaceChanged,
  workspaceDetailsReceived,
  workspaceCreated,
  workspaceMembersReceived,
  workspaceUpdated,
  workspacesCleared,
  workspacesError,
  workspacesLoading,
  userWorkspacesReceived,
} from "../store/workspaceSlice";
import type {
  UserWorkspace,
  Workspace,
  WorkspaceMember,
} from "../types/workspace";

const makeUserWorkspace = (
  overrides: Partial<UserWorkspace> = {},
): UserWorkspace => ({
  workspaceId: "w1",
  role: "owner",
  joinedAt: 1000,
  ...overrides,
});

const makeWorkspace = (overrides: Partial<Workspace> = {}): Workspace => ({
  id: "w1",
  name: "Design Team",
  description: "Launch work",
  ownerId: "u1",
  createdAt: 1000,
  updatedAt: 1000,
  ...overrides,
});

const makeMember = (
  overrides: Partial<WorkspaceMember> = {},
): WorkspaceMember => ({
  uid: "u1",
  name: "Rajesh Paudel",
  email: "rajesh@example.com",
  role: "owner",
  joinedAt: 1000,
  ...overrides,
});

describe("workspaceSlice", () => {
  it("starts idle with no workspace selected", () => {
    expect(reducer(undefined, { type: "@@INIT" })).toEqual({
      userWorkspaces: {},
      workspaces: {},
      members: {},
      activeWorkspaceId: null,
      status: "idle",
      error: null,
    });
  });

  it("marks workspaces as loading", () => {
    const state = reducer(undefined, workspacesLoading());
    expect(state.status).toBe("loading");
  });

  it("stores user workspace memberships without changing the personal board selection", () => {
    const state = reducer(
      undefined,
      userWorkspacesReceived({
        w1: makeUserWorkspace({ workspaceId: "w1" }),
        w2: makeUserWorkspace({ workspaceId: "w2", role: "member" }),
      }),
    );
    expect(state.activeWorkspaceId).toBeNull();
    expect(state.status).toBe("synced");
  });

  it("keeps the current active workspace when it still belongs to the user", () => {
    const current = reducer(undefined, activeWorkspaceChanged("w2"));
    const state = reducer(
      current,
      userWorkspacesReceived({
        w1: makeUserWorkspace({ workspaceId: "w1" }),
        w2: makeUserWorkspace({ workspaceId: "w2" }),
      }),
    );
    expect(state.activeWorkspaceId).toBe("w2");
  });

  it("clears a stale active workspace when membership disappears", () => {
    const current = reducer(undefined, activeWorkspaceChanged("w2"));
    const state = reducer(
      current,
      userWorkspacesReceived({
        w1: makeUserWorkspace({ workspaceId: "w1" }),
      }),
    );
    expect(state.activeWorkspaceId).toBeNull();
  });

  it("stores workspace details and members", () => {
    let state = reducer(
      undefined,
      workspaceDetailsReceived({ w1: makeWorkspace() }),
    );
    state = reducer(
      state,
      workspaceMembersReceived({ workspaceId: "w1", members: { u1: makeMember() } }),
    );
    expect(state.workspaces.w1?.name).toBe("Design Team");
    expect(state.members.w1?.u1?.role).toBe("owner");
  });

  it("stores a newly created workspace immediately", () => {
    const workspace = makeWorkspace();
    const member = makeMember();
    const userWorkspace = makeUserWorkspace();

    const state = reducer(
      undefined,
      workspaceCreated({ workspace, member, userWorkspace }),
    );

    expect(state.workspaces.w1).toEqual(workspace);
    expect(state.members.w1?.u1).toEqual(member);
    expect(state.userWorkspaces.w1).toEqual(userWorkspace);
    expect(state.activeWorkspaceId).toBe("w1");
    expect(state.status).toBe("synced");
  });

  it("updates a workspace detail record", () => {
    const current = reducer(
      undefined,
      workspaceDetailsReceived({ w1: makeWorkspace() }),
    );

    const state = reducer(
      current,
      workspaceUpdated(
        makeWorkspace({
          name: "Growth Team",
          description: "Campaign planning",
          updatedAt: 2000,
        }),
      ),
    );

    expect(state.workspaces.w1?.name).toBe("Growth Team");
    expect(state.workspaces.w1?.description).toBe("Campaign planning");
    expect(state.workspaces.w1?.updatedAt).toBe(2000);
  });

  it("records errors and clears state on logout", () => {
    let state = reducer(undefined, workspacesError("No access"));
    expect(state.status).toBe("error");
    expect(state.error).toBe("No access");

    state = reducer(state, workspacesCleared());
    expect(state).toEqual(reducer(undefined, { type: "@@INIT" }));
  });
});
