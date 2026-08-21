export type WorkspaceRole = "owner" | "admin" | "member";

export interface Workspace {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  createdAt: number;
  updatedAt: number;
}

export interface WorkspaceMember {
  uid: string;
  name: string;
  email: string;
  role: WorkspaceRole;
  joinedAt: number;
}

export interface UserWorkspace {
  workspaceId: string;
  role: WorkspaceRole;
  joinedAt: number;
}

export type NewWorkspace = Pick<Workspace, "name" | "description">;
