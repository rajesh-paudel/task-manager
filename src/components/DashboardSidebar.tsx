import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { CheckSquare, BarChart3, ListChecks, LogOut } from "lucide-react";
import { useAppDispatch, useAppSelector } from "../store/store";
import { signOut } from "firebase/auth";
import profilePlaceholder from "../assets/profilePlaceholder.png";
import { auth } from "../utils/firebaseConfig";
import { clearProfile } from "../store/authSlice";
const navItems = [
  { label: "Overview", path: "/dashboard/overview", icon: BarChart3 },
  { label: "Tasks", path: "/dashboard/tasks", icon: ListChecks },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const userProfile = useAppSelector((state) => state.auth.userProfile);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const handleSignOut = () => {
    signOut(auth).then(() => {
      dispatch(clearProfile());
      navigate("/login");
    });
  };
  return (
    <>
      <aside className="w-60 shrink-0 border-r border-slate-200 flex flex-col justify-between h-screen sticky top-0">
        <div>
          <div className="h-16 flex items-center gap-2.5 px-5 border-b border-slate-100">
            <div className="h-8 w-8 bg-orange-600 rounded-lg flex items-center justify-center text-white">
              <CheckSquare className="h-4 w-4" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              TaskPulse
            </span>
          </div>

          <nav className="px-3 py-4 space-y-1">
            {navItems.map(({ label, path, icon: Icon }) => (
              <NavLink
                key={path}
                to={path}
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
              onClick={() => navigate("/profile")}
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
