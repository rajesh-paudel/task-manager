import { useMemo, useState, type FormEvent } from "react";
import { Building2, MailPlus, Plus, ShieldCheck, Users } from "lucide-react";
import { addWorkspaceMember, createWorkspace } from "../../api/workspaces";
import { findUserByEmail } from "../../api/users";
import { useToast } from "../../context/useToast";
import { getErrorMessage } from "../../utils/firebaseErrors";
import { useAppDispatch, useAppSelector } from "../../store/store";
import {
  selectActiveWorkspaceId,
  selectActiveWorkspaceMembers,
  selectAllWorkspaces,
  selectWorkspaceStatus,
} from "../../store/workspaceSelectors";
import {
  activeWorkspaceChanged,
  workspaceCreated,
} from "../../store/workspaceSlice";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Textarea from "../ui/Textarea";
import type { WorkspaceRole } from "../../types/workspace";

export default function DashboardWorkspaces() {
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const workspaceStatus = useAppSelector(selectWorkspaceStatus);
  const activeWorkspaceId = useAppSelector(selectActiveWorkspaceId);
  const userWorkspaces = useAppSelector(
    (state) => state.workspaces.userWorkspaces,
  );
  const workspaces = useAppSelector(selectAllWorkspaces);
  const activeMembers = useAppSelector(selectActiveWorkspaceMembers);
  const { showToast } = useToast();

  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteRole, setInviteRole] =
    useState<Exclude<WorkspaceRole, "owner">>("member");
  const [inviteError, setInviteError] = useState("");
  const [inviting, setInviting] = useState(false);

  const activeWorkspace = useMemo(
    () => workspaces.find((workspace) => workspace.id === activeWorkspaceId),
    [activeWorkspaceId, workspaces],
  );
  const currentMember = activeMembers.find(
    (member) => member.uid === userProfile?.uid,
  );
  const canInvite =
    Boolean(activeWorkspace) &&
    (activeWorkspace?.ownerId === userProfile?.uid ||
      currentMember?.role === "admin" ||
      currentMember?.role === "owner");

  const resetForm = () => {
    setName("");
    setDescription("");
    setError("");
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    resetForm();
  };

  const closeInviteModal = () => {
    if (inviting) return;
    setInviteModalOpen(false);
    setInviteEmail("");
    setInviteRole("member");
    setInviteError("");
  };

  const handleCreateWorkspace = async (e: FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;

    const trimmedName = name.trim();
    if (trimmedName.length < 2) {
      setError("Workspace name must be at least 2 characters.");
      return;
    }

    setSaving(true);
    setError("");
    try {
      const createdWorkspace = await createWorkspace(userProfile, {
        name: trimmedName,
        description,
      });
      dispatch(workspaceCreated(createdWorkspace));
      showToast("Workspace created");
      setModalOpen(false);
      resetForm();
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Couldn't create workspace. Try again."));
    } finally {
      setSaving(false);
    }
  };

  const handleInviteMember = async (e: FormEvent) => {
    e.preventDefault();
    if (!activeWorkspace || !userProfile) return;

    const email = inviteEmail.trim().toLowerCase();
    if (!email) {
      setInviteError("Email is required.");
      return;
    }
    if (email === userProfile.email.toLowerCase()) {
      setInviteError("You are already a member of this workspace.");
      return;
    }
    if (activeMembers.some((member) => member.email.toLowerCase() === email)) {
      setInviteError("That user is already in this workspace.");
      return;
    }

    setInviting(true);
    setInviteError("");
    try {
      const user = await findUserByEmail(email);
      if (!user) {
        setInviteError("No registered user found with that email.");
        return;
      }
      await addWorkspaceMember(activeWorkspace, user, inviteRole);
      showToast("Member added to workspace");
      setInviteModalOpen(false);
      setInviteEmail("");
      setInviteRole("member");
    } catch (err: unknown) {
      setInviteError(getErrorMessage(err, "Couldn't invite member. Try again."));
    } finally {
      setInviting(false);
    }
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-6 sm:px-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Workspaces
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Organize shared projects, members, and team task boards.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          New workspace
        </Button>
      </div>

      {workspaceStatus === "loading" || workspaceStatus === "idle" ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[0, 1, 2, 3].map((item) => (
            <div
              key={item}
              className="h-36 bg-white border border-slate-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <div className="mt-8 bg-white border border-slate-200 rounded-xl px-6 py-14 text-center">
          <div className="mx-auto h-12 w-12 rounded-lg bg-orange-50 text-orange-600 flex items-center justify-center">
            <Building2 className="h-6 w-6" />
          </div>
          <h2 className="mt-5 text-lg font-semibold text-slate-900">
            Create your first team workspace
          </h2>
          <p className="mt-2 max-w-md mx-auto text-sm text-slate-500">
            Workspaces let you separate client projects, product teams, or
            internship demos with their own members and shared task boards.
          </p>
          <Button className="mt-6" onClick={() => setModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Create workspace
          </Button>
        </div>
      ) : (
        <div className="mt-8 grid gap-5 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)]">
          <section className="space-y-3">
            <button
              onClick={() => dispatch(activeWorkspaceChanged(null))}
              className={`w-full text-left bg-white border rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift ${
                activeWorkspaceId === null
                  ? "border-orange-300 ring-2 ring-orange-100"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                    activeWorkspaceId === null
                      ? "bg-orange-50 text-orange-600"
                      : "bg-slate-100 text-slate-500"
                  }`}
                >
                  <Users className="h-5 w-5" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h2 className="text-base font-semibold text-slate-900 truncate">
                      Personal board
                    </h2>
                    {activeWorkspaceId === null && (
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
                        Active
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Your private task list, calendar, and productivity stats.
                  </p>
                </div>
              </div>
            </button>

            {workspaces.map((workspace) => {
              const isActive = workspace.id === activeWorkspaceId;
              const membership = userWorkspaces[workspace.id];
              return (
                <button
                  key={workspace.id}
                  onClick={() => dispatch(activeWorkspaceChanged(workspace.id))}
                  className={`w-full text-left bg-white border rounded-xl p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lift ${
                    isActive
                      ? "border-orange-300 ring-2 ring-orange-100"
                      : "border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${
                        isActive
                          ? "bg-orange-50 text-orange-600"
                          : "bg-slate-100 text-slate-500"
                      }`}
                    >
                      <Building2 className="h-5 w-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h2 className="text-base font-semibold text-slate-900 truncate">
                          {workspace.name}
                        </h2>
                        {isActive && (
                          <span className="rounded-full bg-orange-50 px-2 py-0.5 text-xs font-medium text-orange-600">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="mt-1 text-sm text-slate-500 line-clamp-2">
                        {workspace.description || "No description yet."}
                      </p>
                      <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-400">
                        <span className="inline-flex items-center gap-1.5">
                          <ShieldCheck className="h-3.5 w-3.5" />
                          {workspace.ownerId === userProfile?.uid
                            ? "Owner workspace"
                            : `${membership?.role ?? "Member"} workspace`}
                        </span>
                        <span>
                          Updated{" "}
                          {new Date(workspace.updatedAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </section>

          <aside className="bg-white border border-slate-200 rounded-xl p-5 h-fit">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                  Active workspace
                </p>
                <h2 className="mt-1 text-base font-semibold text-slate-900">
                  {activeWorkspace?.name ?? "Personal board"}
                </h2>
              </div>
              <div className="h-10 w-10 rounded-lg bg-slate-100 text-slate-500 flex items-center justify-center">
                <Users className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 border-t border-slate-100 pt-5">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-900">
                  Members
                </h3>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-400">
                    {activeMembers.length}
                  </span>
                  {canInvite && (
                    <button
                      onClick={() => setInviteModalOpen(true)}
                      className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-500 hover:bg-orange-50 hover:text-orange-600"
                      aria-label="Invite member"
                    >
                      <MailPlus className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
              <div className="mt-3 space-y-2">
                {activeMembers.length === 0 ? (
                  <p className="text-sm text-slate-400">
                    {activeWorkspace
                      ? "Member details will appear here after sync."
                      : "Personal tasks are visible only to you."}
                  </p>
                ) : (
                  activeMembers.map((member) => (
                    <div
                      key={member.uid}
                      className="flex items-center gap-3 rounded-lg border border-slate-100 px-3 py-2"
                    >
                      <div className="h-8 w-8 rounded-full bg-orange-50 text-orange-600 flex items-center justify-center text-xs font-semibold">
                        {member.name.slice(0, 1).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-slate-900">
                          {member.name}
                        </p>
                        <p className="truncate text-xs text-slate-400">
                          {member.email}
                        </p>
                      </div>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium capitalize text-slate-600">
                        {member.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          </aside>
        </div>
      )}

      <Modal
        open={modalOpen}
        onClose={closeModal}
        title="Create workspace"
        titleId="create-workspace-title"
        description="Start a shared space for a team, client, or project."
        closeOnBackdrop
      >
        <form onSubmit={handleCreateWorkspace} className="space-y-4">
          <div>
            <label
              htmlFor="workspace-name"
              className="text-sm font-medium text-slate-700"
            >
              Workspace name
            </label>
            <Input
              id="workspace-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Product team"
              className="mt-1"
              invalid={Boolean(error)}
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="workspace-description"
              className="text-sm font-medium text-slate-700"
            >
              Description
            </label>
            <Textarea
              id="workspace-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tasks, launch plans, and team follow-ups"
              rows={4}
              className="mt-1"
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button type="submit" loading={saving}>
              Create
            </Button>
          </div>
        </form>
      </Modal>

      <Modal
        open={inviteModalOpen}
        onClose={closeInviteModal}
        title="Invite member"
        titleId="invite-member-title"
        description="Add an existing TaskPulse user to this workspace."
        closeOnBackdrop
      >
        <form onSubmit={handleInviteMember} className="space-y-4">
          <div>
            <label
              htmlFor="invite-email"
              className="text-sm font-medium text-slate-700"
            >
              Email
            </label>
            <Input
              id="invite-email"
              type="email"
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="teammate@example.com"
              className="mt-1"
              invalid={Boolean(inviteError)}
              autoFocus
            />
          </div>

          <div>
            <label
              htmlFor="invite-role"
              className="text-sm font-medium text-slate-700"
            >
              Role
            </label>
            <select
              id="invite-role"
              value={inviteRole}
              onChange={(e) =>
                setInviteRole(e.target.value as Exclude<WorkspaceRole, "owner">)
              }
              className="mt-1 w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-primary-500"
            >
              <option value="member">Member</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {inviteError && <p className="text-sm text-red-600">{inviteError}</p>}

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button type="button" variant="outline" onClick={closeInviteModal}>
              Cancel
            </Button>
            <Button type="submit" loading={inviting}>
              Add member
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
