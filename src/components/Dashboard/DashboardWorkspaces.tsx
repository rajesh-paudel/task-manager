import { useMemo, useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowRight,
  AlertCircle,
  Building2,
  CheckCircle2,
  Check,
  Clock,
  ClipboardList,
  Loader2,
  Pencil,
  Plus,
  Settings,
  ShieldCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import {
  addWorkspaceMember,
  createWorkspace,
  updateWorkspaceDetails,
} from "../../api/workspaces";
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
import { selectTaskStats } from "../../store/tasksSelectors";
import {
  activeWorkspaceChanged,
  workspaceCreated,
  workspaceUpdated,
} from "../../store/workspaceSlice";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";
import Textarea from "../ui/Textarea";
import type { Workspace, WorkspaceRole } from "../../types/workspace";
import { useEditableField } from "../../hooks/useEditableField";

type WorkspaceTab = "overview" | "members" | "settings";

const tabs: { id: WorkspaceTab; label: string; icon: typeof ClipboardList }[] = [
  { id: "overview", label: "Overview", icon: ClipboardList },
  { id: "members", label: "Members", icon: Users },
  { id: "settings", label: "Settings", icon: Settings },
];

function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function RoleBadge({ role }: { role: WorkspaceRole | "private" }) {
  return (
    <span className="inline-flex items-center rounded-md bg-slate-100 px-2 py-1 text-xs font-medium capitalize text-slate-600">
      {role}
    </span>
  );
}

interface WorkspaceEditableFieldProps {
  label: string;
  value: string;
  onSave: (value: string) => Promise<void>;
  placeholder?: string;
  multiline?: boolean;
  required?: boolean;
  editable: boolean;
}

function WorkspaceEditableField({
  label,
  value,
  onSave,
  placeholder,
  multiline,
  required,
  editable,
}: WorkspaceEditableFieldProps) {
  const field = useEditableField(value, async (nextValue) => {
    if (required && !nextValue) {
      throw new Error(`${label} can't be empty.`);
    }
    await onSave(nextValue);
  });

  return (
    <div className="flex items-start justify-between gap-4 py-5">
      <div className="min-w-0 flex-1">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
          {label}
        </p>

        {field.editing ? (
          multiline ? (
            <textarea
              autoFocus
              rows={3}
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => e.key === "Escape" && field.cancel()}
              className="mt-1.5 w-full resize-none border-0 border-b border-slate-900 bg-transparent px-0 py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          ) : (
            <input
              autoFocus
              value={field.value}
              onChange={(e) => field.setValue(e.target.value)}
              placeholder={placeholder}
              onKeyDown={(e) => {
                if (e.key === "Enter") field.commit();
                if (e.key === "Escape") field.cancel();
              }}
              className="mt-1.5 w-full border-0 border-b border-slate-900 bg-transparent px-0 py-1 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none"
            />
          )
        ) : (
          <p className="mt-1 text-sm leading-relaxed text-slate-900">
            {value || <span className="text-slate-400">Not set</span>}
          </p>
        )}

        {field.error && (
          <p className="mt-1.5 text-xs text-red-600">{field.error}</p>
        )}
      </div>

      {editable && (
        <div className="mt-5 flex shrink-0 items-center gap-1">
          {field.editing ? (
            <>
              <button
                onClick={field.commit}
                disabled={field.saving}
                className="flex h-7 w-7 items-center justify-center rounded-md text-orange-600 hover:bg-orange-50 disabled:opacity-50"
                aria-label={`Save ${label}`}
              >
                {field.saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}
              </button>
              <button
                onClick={field.cancel}
                disabled={field.saving}
                className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-slate-100 disabled:opacity-50"
                aria-label={`Cancel editing ${label}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </>
          ) : (
            <button
              onClick={field.start}
              className="flex h-7 w-7 items-center justify-center rounded-md text-slate-400 hover:bg-orange-50 hover:text-orange-600"
              aria-label={`Edit ${label}`}
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function DashboardWorkspaces() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const workspaceStatus = useAppSelector(selectWorkspaceStatus);
  const activeWorkspaceId = useAppSelector(selectActiveWorkspaceId);
  const userWorkspaces = useAppSelector(
    (state) => state.workspaces.userWorkspaces,
  );
  const workspaces = useAppSelector(selectAllWorkspaces);
  const activeMembers = useAppSelector(selectActiveWorkspaceMembers);
  const taskStats = useAppSelector(selectTaskStats);
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<WorkspaceTab>("overview");
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
  const activeRole =
    activeWorkspaceId === null
      ? "private"
      : userWorkspaces[activeWorkspaceId]?.role;
  const hasManagerRole = activeRole === "owner" || activeRole === "admin";
  const canInvite =
    Boolean(activeWorkspace) &&
    (activeWorkspace?.ownerId === userProfile?.uid ||
      hasManagerRole ||
      currentMember?.role === "admin" ||
      currentMember?.role === "owner");
  const canManageWorkspace =
    Boolean(activeWorkspace) &&
    (activeWorkspace?.ownerId === userProfile?.uid ||
      hasManagerRole ||
      currentMember?.role === "admin" ||
      currentMember?.role === "owner");

  const activeName = activeWorkspace?.name ?? "Personal board";
  const activeDescription =
    activeWorkspace?.description ||
    "Your private task board, calendar, and productivity history.";
  const activeUpdatedAt = activeWorkspace?.updatedAt;
  const memberCount = activeWorkspace ? activeMembers.length : 1;
  const workspaceRows: Array<Workspace | null> = [null, ...workspaces];

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
      setActiveTab("overview");
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

  const selectWorkspace = (workspaceId: string | null) => {
    dispatch(activeWorkspaceChanged(workspaceId));
    setActiveTab("overview");
  };

  const saveWorkspaceField = async (
    field: "name" | "description",
    value: string,
  ) => {
    if (!activeWorkspace || !canManageWorkspace) return;

    const updatedWorkspace = await updateWorkspaceDetails(activeWorkspace, {
      name: field === "name" ? value : activeWorkspace.name,
      description:
        field === "description" ? value : activeWorkspace.description,
    });
    dispatch(workspaceUpdated(updatedWorkspace));
    showToast("Workspace updated");
  };

  return (
    <div className="min-h-screen max-w-6xl mx-auto px-6 sm:px-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900 tracking-tight">
            Workspaces
          </h1>
          <p className="mt-1 text-sm text-slate-500">
            Manage spaces, members, and the task scope used across Dashboard.
          </p>
        </div>
        <Button onClick={() => setModalOpen(true)}>
          <Plus className="h-4 w-4" />
          New workspace
        </Button>
      </div>

      {workspaceStatus === "loading" || workspaceStatus === "idle" ? (
        <div className="mt-8 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <div className="h-96 rounded-lg border border-slate-200 bg-white animate-pulse" />
          <div className="h-96 rounded-lg border border-slate-200 bg-white animate-pulse" />
        </div>
      ) : (
        <div className="mt-8 grid gap-5 lg:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="h-fit rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                Your spaces
              </p>
              <span className="text-xs text-slate-400">
                {workspaces.length + 1}
              </span>
            </div>
            <div className="p-2">
              {workspaceRows.map((workspace) => {
                const isPersonal = workspace === null;
                const workspaceId = workspace?.id ?? null;
                const isActive = workspaceId === activeWorkspaceId;
                const role = isPersonal
                  ? "private"
                  : userWorkspaces[workspace.id]?.role;

                return (
                  <button
                    key={workspace?.id ?? "personal"}
                    onClick={() => selectWorkspace(workspaceId)}
                    className={`w-full rounded-lg px-3 py-3 text-left transition-colors ${
                      isActive
                        ? "bg-orange-50 text-orange-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          isActive
                            ? "bg-white text-orange-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {isPersonal ? (
                          <Users className="h-4 w-4" />
                        ) : (
                          <Building2 className="h-4 w-4" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <p className="truncate text-sm font-semibold">
                            {workspace?.name ?? "Personal board"}
                          </p>
                          {isActive && (
                            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-orange-600" />
                          )}
                        </div>
                        <div className="mt-1 flex items-center gap-2">
                          <RoleBadge role={role ?? "member"} />
                          {!isPersonal && (
                            <span className="truncate text-xs text-slate-400">
                              {formatDate(workspace.updatedAt)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </aside>

          <section className="rounded-lg border border-slate-200 bg-white">
            <div className="border-b border-slate-100 p-5">
              <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                <div className="flex min-w-0 items-start gap-4">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-orange-600">
                    {activeWorkspace ? (
                      <Building2 className="h-5 w-5" />
                    ) : (
                      <Users className="h-5 w-5" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="truncate text-xl font-semibold text-slate-900">
                        {activeName}
                      </h2>
                      <RoleBadge role={activeRole ?? "member"} />
                    </div>
                    <p className="mt-1 max-w-2xl text-sm text-slate-500">
                      {activeDescription}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {canInvite && (
                    <Button
                      variant="outline"
                      onClick={() => setInviteModalOpen(true)}
                    >
                      <UserPlus className="h-4 w-4" />
                      Invite
                    </Button>
                  )}
                  <Button onClick={() => navigate("/dashboard/tasks")}>
                    Tasks
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {tabs.map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`inline-flex items-center gap-1.5 border-b-2 px-3 py-2 text-sm font-medium transition-colors ${
                      activeTab === id
                        ? "border-orange-600 text-orange-600"
                        : "border-transparent text-slate-500 hover:text-slate-900"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {label}
                    {id === "members" && (
                      <span
                        className={`rounded-md px-1.5 py-0.5 text-xs ${
                          activeTab === id
                            ? "bg-orange-50 text-orange-600"
                            : "bg-slate-100 text-slate-500"
                        }`}
                      >
                        {memberCount}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-5">
              {activeTab === "overview" && (
                <div className="space-y-5">
                  <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
                    {[
                      {
                        label: "Total tasks",
                        value: taskStats.total,
                        icon: ClipboardList,
                        tone: "text-slate-500",
                      },
                      {
                        label: "To do",
                        value: taskStats.todo,
                        icon: ClipboardList,
                        tone: "text-slate-500",
                      },
                      {
                        label: "In progress",
                        value: taskStats.inProgress,
                        icon: Clock,
                        tone: "text-blue-600",
                      },
                      {
                        label: "Completed",
                        value: taskStats.done,
                        icon: CheckCircle2,
                        tone: "text-emerald-600",
                      },
                      {
                        label: "Overdue",
                        value: taskStats.overdue,
                        icon: AlertCircle,
                        tone: "text-red-600",
                      },
                    ].map(({ label, value, icon: Icon, tone }) => (
                      <div
                        key={label}
                        className="rounded-lg border border-slate-200 p-4"
                      >
                        <Icon className={`h-4 w-4 ${tone}`} />
                        <p className="mt-3 text-2xl font-semibold text-slate-900">
                          {value}
                        </p>
                        <p className="text-xs text-slate-500">{label}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-lg border border-slate-200 p-4">
                    <h3 className="text-sm font-semibold text-slate-900">
                      Workspace summary
                    </h3>
                    <dl className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
                      <div>
                        <dt className="text-slate-400">Scope</dt>
                        <dd className="mt-1 font-medium text-slate-900">
                          {activeWorkspace ? "Shared workspace" : "Private"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Your access</dt>
                        <dd className="mt-1 font-medium capitalize text-slate-900">
                          {activeRole ?? "member"}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-slate-400">Last updated</dt>
                        <dd className="mt-1 font-medium text-slate-900">
                          {activeUpdatedAt
                            ? formatDate(activeUpdatedAt)
                            : "Today"}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              )}

              {activeTab === "members" && (
                <div>
                  <div className="mb-4">
                    <div>
                      <h3 className="text-sm font-semibold text-slate-900">
                        Members
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {activeWorkspace
                          ? `${activeMembers.length} people have access to this workspace.`
                          : "Personal tasks are visible only to you."}
                      </p>
                    </div>
                  </div>

                  {activeWorkspace ? (
                    <div className="divide-y divide-slate-100 rounded-lg border border-slate-200">
                      {activeMembers.map((member) => (
                        <div
                          key={member.uid}
                          className="flex items-center gap-3 px-4 py-3"
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange-50 text-sm font-semibold text-orange-600">
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
                          <RoleBadge role={member.role} />
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-lg border border-slate-200 p-6 text-center">
                      <ShieldCheck className="mx-auto h-6 w-6 text-orange-600" />
                      <p className="mt-3 text-sm font-medium text-slate-900">
                        Private by default
                      </p>
                      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500">
                        Create or select a shared workspace when you need task
                        assignment and member collaboration.
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === "settings" && (
                <div className="space-y-4">
                  <div className="rounded-lg border border-slate-200 p-4">
                    <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <h3 className="text-sm font-semibold text-slate-900">
                          Workspace details
                        </h3>
                        <p className="mt-1 text-sm text-slate-500">
                          Owners and admins can edit each workspace field.
                        </p>
                      </div>
                      <RoleBadge role={activeRole ?? "member"} />
                    </div>

                    {!activeWorkspace ? (
                      <div className="mt-5 rounded-lg border border-slate-200 bg-slate-50 p-4">
                        <p className="text-sm font-medium text-slate-900">
                          Personal board settings are fixed
                        </p>
                        <p className="mt-1 text-sm text-slate-500">
                          Select a shared workspace to edit its name and
                          description.
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className="mt-3 divide-y divide-slate-100">
                          <WorkspaceEditableField
                            label="Name"
                            value={activeWorkspace.name}
                            required
                            editable={canManageWorkspace}
                            onSave={(value) => saveWorkspaceField("name", value)}
                          />
                          <WorkspaceEditableField
                            label="Description"
                            value={activeWorkspace.description}
                            placeholder="Describe this workspace"
                            multiline
                            editable={canManageWorkspace}
                            onSave={(value) =>
                              saveWorkspaceField("description", value)
                            }
                          />
                          <div className="flex items-start justify-between gap-4 py-5">
                            <div>
                              <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                                Type
                              </p>
                              <p className="mt-1 text-sm text-slate-900">
                                Shared workspace
                              </p>
                            </div>
                          </div>
                        </div>
                        {!canManageWorkspace && (
                          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                            <p className="text-sm text-slate-500">
                              Ask a workspace owner or admin to change these
                              details.
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>
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
