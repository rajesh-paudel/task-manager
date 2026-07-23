import { useState, useRef, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { CheckSquare, LayoutDashboard, User, LogOut } from "lucide-react";
import type { UserProfile } from "../../types/user";
import profilePlaceholder from "../../assets/profilePlaceholder.png";
import ThemeToggle from "../ui/ThemeToggle";

interface NavbarProps {
  userProfile: UserProfile | null;
  onLogout: () => void;
}

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Pricing", path: "/pricing" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

const Navbar = ({ userProfile, onLogout }: NavbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  return (
    <>
      <nav aria-label="Main navigation" className="w-full bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 shrink-0">
            <div className="h-9 w-9 bg-orange-600 rounded-lg flex items-center justify-center text-white">
              <CheckSquare className="h-5 w-5" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              TaskPulse
            </span>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) =>
                  `px-3.5 py-2 text-sm font-medium rounded-lg hover:bg-slate-50 ${
                    isActive
                      ? "text-orange-600"
                      : "text-slate-600 hover:text-slate-900"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-1 shrink-0">
            <ThemeToggle />
            {userProfile ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuOpen((open) => !open)}
                  className="flex items-center justify-center rounded-full"
                >
                  <img
                    src={
                      userProfile?.profileUrl
                        ? userProfile.profileUrl
                        : profilePlaceholder
                    }
                    alt={userProfile?.name}
                    className="h-10 w-10 rounded-full object-cover  "
                  />
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
                    <div className="p-4 flex items-center gap-3 border-b border-slate-100">
                      <img
                        src={
                          userProfile?.profileUrl
                            ? userProfile.profileUrl
                            : profilePlaceholder
                        }
                        alt={userProfile.name}
                        className="h-11 w-11 rounded-full object-cover"
                      />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                          {userProfile.name}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                          {userProfile.email}
                        </p>
                      </div>
                    </div>
                    <div className="p-1.5">
                      <Link
                        to="/dashboard"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        Dashboard
                      </Link>
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 rounded-lg"
                      >
                        <User className="h-4 w-4" />
                        Profile
                      </Link>
                      <button
                        onClick={() => {
                          setMenuOpen(false);
                          setConfirmOpen(true);
                        }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-sm font-medium text-slate-600 hover:text-slate-900 px-3 py-2"
                >
                  Log in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 px-4 py-2 rounded-lg"
                >
                  Get started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Sign out confirmation dialog */}
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
                onClick={() => {
                  setConfirmOpen(false);
                  onLogout();
                }}
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
};

export default Navbar;
