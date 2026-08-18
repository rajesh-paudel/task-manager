import { lazy, Suspense, useEffect } from "react";
import { subscribeToAuthState, logout } from "./api/auth";
import { subscribeToUserProfile } from "./api/users";
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";
import { useAppDispatch } from "./store/store";
import { useAppSelector } from "./store/store";
import { setProfile, clearProfile } from "./store/authSlice";

import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import Footer from "./components/layout/Footer";
import DashboardLayout from "./components/Dashboard/DashboardLayout";

//lazy loading or code splitting
const Home = lazy(() => import("./Pages/Home"));
const Login = lazy(() => import("./Pages/Login"));
const Register = lazy(() => import("./Pages/Register"));
const Profile = lazy(() => import("./Pages/Profile"));
const Contact = lazy(() => import("./Pages/Contact"));
const About = lazy(() => import("./Pages/About"));
const Pricing = lazy(() => import("./Pages/Pricing"));
const NotFound = lazy(() => import("./Pages/NotFound"));
const Overview = lazy(() => import("./components/Dashboard/DashboardOverview"));
const Tasks = lazy(() => import("./components/Dashboard/DashboardTasks"));
const Calendar = lazy(
  () => import("./components/Dashboard/DashboardCalendar"),
);
const DashboardAdmin = lazy(
  () => import("./components/Dashboard/DashboardAdmin"),
);

import PublicRoute from "./components/ui/PublicRoute";
import ProtectedRoute from "./components/ui/PrivateRoute";

export default function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const hideFooter = ["/login", "/register"].includes(location.pathname);
  const hideLayout = location.pathname.startsWith("/dashboard");
  const { userProfile, loading } = useAppSelector((state) => state.auth);
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);
  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = subscribeToAuthState((user) => {
      if (unsubscribeProfile) unsubscribeProfile();

      if (user) {
        unsubscribeProfile = subscribeToUserProfile(user.uid, (profile) => {
          dispatch(profile ? setProfile(profile) : clearProfile());
        });
      } else {
        dispatch(clearProfile());
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeProfile) unsubscribeProfile();
    };
  }, [dispatch]);

  const handleLogout = () => {
    logout().then(() => {
      dispatch(clearProfile());
      navigate("/login");
    });
  };
  if (loading) {
    return (
      <ThemeProvider>
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div className="min-h-screen  flex flex-col bg-slate-50">
        {!hideLayout && (
          <header>
            <Navbar userProfile={userProfile} onLogout={handleLogout} />
          </header>
        )}
        <ErrorBoundary>
          <Suspense
            fallback={
              <div className="min-h-screen bg-slate-50 flex items-center justify-center">
                <div className="h-6 w-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />
              <Route element={<PublicRoute />}>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Route>
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="overview" replace />} />
                  <Route path="overview" element={<Overview />} />
                  <Route path="tasks" element={<Tasks />} />
                  <Route path="calendar" element={<Calendar />} />
                  <Route
                    path="admin"
                    element={
                      userProfile?.role === "admin" ? (
                        <DashboardAdmin />
                      ) : (
                        <Navigate to="/dashboard/overview" replace />
                      )
                    }
                  />
                </Route>
              </Route>
              <Route path="/contact" element={<Contact />} />
              <Route path="/about" element={<About />} />
              <Route path="/pricing" element={<Pricing />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
        </ErrorBoundary>
        {!hideLayout && !hideFooter && <Footer />}
      </div>
    </ThemeProvider>
  );
}
