import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  CheckSquare,
  BarChart3,
  ListChecks,
  LogOut,
  Menu,
  X,
  Calendar,
  Building2,
  ChevronDown,
  Users,
} from "lucide-react";
import { RiAdminFill } from "react-icons/ri";
import { useAppDispatch, useAppSelector } from "../../store/store";
import { logout } from "../../api/auth";
import profilePlaceholder from "../../assets/profilePlaceholder.png";
import { clearProfile } from "../../store/authSlice";
import { activeWorkspaceChanged } from "../../store/workspaceSlice";
import {
  selectActiveWorkspace,
  selectActiveWorkspaceId,
  selectAllWorkspaces,
} from "../../store/workspaceSelectors";

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const activeWorkspaceId = useAppSelector(selectActiveWorkspaceId);
  const activeWorkspace = useAppSelector(selectActiveWorkspace);
  const workspaces = useAppSelector(selectAllWorkspaces);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const baseNavItems = [
    { label: "Overview", path: "/dashboard/overview", icon: BarChart3 },
    { label: "Tasks", path: "/dashboard/tasks", icon: ListChecks },
    { label: "Calendar", path: "/dashboard/calendar", icon: Calendar },
    { label: "Workspaces", path: "/dashboard/workspaces", icon: Building2 },
  ];

  const adminNavItem = {
    label: "Admin",
    path: "/dashboard/admin",
    icon: RiAdminFill,
  };

  const navItems =
    userProfile?.role === "admin"
      ? [...baseNavItems, adminNavItem]
      : baseNavItems;

  const closeMobile = () => setMobileOpen(false);

  const handleSignOut = () => {
    logout().then(() => {
      dispatch(clearProfile());
      navigate("/login");
    });
  };

  const handleWorkspaceChange = (workspaceId: string) => {
    dispatch(
      activeWorkspaceChanged(workspaceId === "personal" ? null : workspaceId),
    );
  };

  return (
    <>
      <div className="md:hidden h-14 flex items-center justify-between px-4 border-b border-slate-200 bg-white sticky top-0 z-30">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 bg-orange-600 rounded-lg flex items-center justify-center text-white">
            <CheckSquare className="h-4 w-4" />
          </div>
          <span className="text-sm font-bold text-slate-900 tracking-tight">
            TaskPulse
          </span>
        </div>
        <button
          onClick={() => setMobileOpen(true)}
          className="h-9 w-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-50"
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" />
        </button>
      </div>

      {mobileOpen && (
        <div
          onClick={closeMobile}
          className="md:hidden fixed inset-0 z-40 bg-slate-900/40"
          aria-hidden="true"
        />
      )}

      <aside
        className={`fixed inset-y-0 right-0 z-50 w-64 bg-white border-l border-slate-200 flex flex-col justify-between transition-transform duration-200 ${
          mobileOpen ? "translate-x-0" : "translate-x-full"
        } md:static md:translate-x-0 md:z-auto md:w-60 md:shrink-0 md:h-screen md:sticky md:top-0 md:border-l-0 md:border-r`}
      >
        <div>
          <div className="h-16 flex items-center justify-between gap-2.5 px-5 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
                <CheckSquare className="h-4 w-4" />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">
                TaskPulse
              </span>
            </div>
            <button
              onClick={closeMobile}
              className="md:hidden h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-slate-50"
              aria-label="Close menu"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="px-3 py-4 border-b border-slate-100">
            <label
              htmlFor="workspace-switcher"
              className="text-xs font-medium uppercase tracking-wide text-slate-400"
            >
              Workspace
            </label>
            <div className="relative mt-2">
              <select
                id="workspace-switcher"
                value={activeWorkspaceId ?? "personal"}
                onChange={(e) => handleWorkspaceChange(e.target.value)}
                className="w-full appearance-none rounded-lg border border-slate-200 bg-white py-2 pl-9 pr-9 text-sm font-medium text-slate-800 outline-none transition-colors hover:border-slate-300 focus:border-orange-500"
              >
                <option value="personal">Personal board</option>
                {workspaces.map((workspace) => (
                  <option key={workspace.id} value={workspace.id}>
                    {workspace.name}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
                {activeWorkspace ? (
                  <Building2 className="h-4 w-4" />
                ) : (
                  <Users className="h-4 w-4" />
                )}
              </div>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
            <p className="mt-2 truncate text-xs text-slate-400">
              Viewing {activeWorkspace?.name ?? "Personal board"}
            </p>
          </div>

          <nav className="px-3 py-4 space-y-1">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
                onClick={closeMobile}
                className={({ isActive }) =>
                  `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium ${
                    isActive
                      ? "bg-orange-50 text-orange-600"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
          </nav>
        </div>

        {userProfile && (
          <div className="px-3 py-4 border-t border-slate-100">
            <button
              onClick={() => {
                closeMobile();
                navigate("/profile");
              }}
              className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-slate-50 text-left"
            >
              <img
                src={userProfile.profileUrl || profilePlaceholder}
                alt={userProfile.name}
                className="h-8 w-8 rounded-full object-cover shrink-0"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-slate-900 truncate">
                  {userProfile.name}
                </p>
                <p className="text-xs text-slate-400 truncate">
                  {userProfile.email}
                </p>
              </div>
            </button>
            <button
              onClick={() => setConfirmOpen(true)}
              className="w-full mt-1 flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
            >
              <LogOut className="h-4 w-4" />
              Sign out
            </button>
          </div>
        )}
      </aside>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="bg-white rounded-lg shadow-xl max-w-sm w-full p-6">
            <h2 className="text-lg font-semibold text-slate-900">Log out?</h2>
            <p className="mt-2 text-sm text-slate-500">
              Are you sure you want to log out of your account?
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleSignOut}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-lg"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
