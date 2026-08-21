import {
  get,
  onValue,
  push,
  ref,
  update,
  type Unsubscribe,
} from "firebase/database";
import type { UserProfile } from "../types/user";
import type {
  NewWorkspace,
  UserWorkspace,
  Workspace,
  WorkspaceMember,
  WorkspaceRole,
} from "../types/workspace";
import { db } from "../utils/firebaseConfig";
import {
  isUserWorkspace,
  isWorkspace,
  isWorkspaceMember,
} from "../utils/typeGuards";

export function subscribeToUserWorkspaces(
  uid: string,
  onData: (workspaces: Record<string, UserWorkspace>) => void,
  onError: (message: string) => void,
): Unsubscribe {
  return onValue(
    ref(db, `userWorkspaces/${uid}`),
    (snapshot) => {
      const data = snapshot.val() || {};
      const workspaces = Object.entries(data).reduce<
        Record<string, UserWorkspace>
      >((acc, [workspaceId, value]) => {
        if (isUserWorkspace(value)) {
          acc[workspaceId] = value;
        }
        return acc;
      }, {});
      onData(workspaces);
    },
    (err) => onError(err.message),
  );
}

export function subscribeToWorkspaceMembers(
  workspaceId: string,
  onData: (members: Record<string, WorkspaceMember>) => void,
  onError: (message: string) => void,
): Unsubscribe {
  return onValue(
    ref(db, `workspaceMembers/${workspaceId}`),
    (snapshot) => {
      const data = snapshot.val() || {};
      const members = Object.entries(data).reduce<
        Record<string, WorkspaceMember>
      >((acc, [uid, value]) => {
        if (isWorkspaceMember(value)) {
          acc[uid] = value;
        }
        return acc;
      }, {});
      onData(members);
    },
    (err) => onError(err.message),
  );
}

export async function fetchWorkspace(
  workspaceId: string,
): Promise<Workspace | null> {
  const snapshot = await get(ref(db, `workspaces/${workspaceId}`));
  const data = snapshot.val();
  return isWorkspace(data) ? data : null;
}

export async function fetchWorkspacesByIds(
  workspaceIds: string[],
): Promise<Record<string, Workspace>> {
  const uniqueIds = Array.from(new Set(workspaceIds));
  const entries = await Promise.all(
    uniqueIds.map(async (workspaceId) => {
      const workspace = await fetchWorkspace(workspaceId);
      return workspace ? ([workspaceId, workspace] as const) : null;
    }),
  );
  return entries.reduce<Record<string, Workspace>>((acc, entry) => {
    if (entry) {
      const [workspaceId, workspace] = entry;
      acc[workspaceId] = workspace;
    }
    return acc;
  }, {});
}

export async function createWorkspace(
  owner: UserProfile,
  newWorkspace: NewWorkspace,
): Promise<{
  workspace: Workspace;
  member: WorkspaceMember;
  userWorkspace: UserWorkspace;
}> {
  const workspaceRef = push(ref(db, "workspaces"));
  const workspaceId = workspaceRef.key;
  if (!workspaceId) {
    throw new Error("Unable to create workspace. Please try again.");
  }

  const now = Date.now();
  const workspace: Workspace = {
    id: workspaceId,
    name: newWorkspace.name.trim(),
    description: newWorkspace.description.trim(),
    ownerId: owner.uid,
    createdAt: now,
    updatedAt: now,
  };
  const member: WorkspaceMember = {
    uid: owner.uid,
    name: owner.name,
    email: owner.email,
    role: "owner",
    joinedAt: now,
  };
  const userWorkspace: UserWorkspace = {
    workspaceId,
    role: "owner",
    joinedAt: now,
  };

  await update(ref(db), {
    [`workspaces/${workspaceId}`]: workspace,
    [`workspaceMembers/${workspaceId}/${owner.uid}`]: member,
    [`userWorkspaces/${owner.uid}/${workspaceId}`]: userWorkspace,
  });

  return { workspace, member, userWorkspace };
}

export async function addWorkspaceMember(
  workspace: Workspace,
  user: UserProfile,
  role: Exclude<WorkspaceRole, "owner"> = "member",
): Promise<void> {
  const now = Date.now();
  const member: WorkspaceMember = {
    uid: user.uid,
    name: user.name,
    email: user.email,
    role,
    joinedAt: now,
  };
  const userWorkspace: UserWorkspace = {
    workspaceId: workspace.id,
    role,
    joinedAt: now,
  };

  await update(ref(db), {
    [`workspaceMembers/${workspace.id}/${user.uid}`]: member,
    [`userWorkspaces/${user.uid}/${workspace.id}`]: userWorkspace,
    [`workspaces/${workspace.id}/updatedAt`]: now,
  });
}
