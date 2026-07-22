import { lazy, useEffect } from "react";
import { auth, db } from "./utils/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
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

import Navbar from "./components/layout/Navbar";
import ErrorBoundary from "./components/ui/ErrorBoundary";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import Home from "./Pages/Home";
import Footer from "./components/layout/Footer";
import Profile from "./Pages/Profile";
import DashboardLayout from "./components/Dashboard/DashboardLayout";
import Contact from "./Pages/Contact";
import About from "./Pages/About";
import Pricing from "./Pages/Pricing";
import NotFound from "./Pages/NotFound";
import PublicRoute from "./components/ui/PublicRoute";
import ProtectedRoute from "./components/ui/PrivateRoute";

const Overview = lazy(() => import("./components/Dashboard/DashboardOverview"));
const Tasks = lazy(() => import("./components/Dashboard/DashboardTasks"));
const DashboardAdmin = lazy(
  () => import("./components/Dashboard/DashboardAdmin"),
);

export default function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const hideFooter = ["/login", "/register"].includes(location.pathname);
  const hideLayout = location.pathname.startsWith("/dashboard");
  const { userProfile, loading } = useAppSelector((state) => state.auth);
  useEffect(() => {
    let unsubscribeProfile: (() => void) | undefined;

    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (unsubscribeProfile) unsubscribeProfile();

      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        unsubscribeProfile = onValue(userRef, (snapshot) => {
          const profileData = snapshot.val();
          if (
            profileData &&
            (profileData.role === "admin" || profileData.role === "user")
          ) {
            dispatch(setProfile(profileData));
          } else {
            dispatch(clearProfile());
          }
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
    signOut(auth).then(() => {
      dispatch(clearProfile());
      navigate("/login");
    });
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen  flex flex-col bg-slate-50">
      {!hideLayout && (
        <Navbar userProfile={userProfile} onLogout={handleLogout} />
      )}
      <ErrorBoundary key={location.pathname}>
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
      </ErrorBoundary>
      {!hideLayout && !hideFooter && <Footer />}
    </div>
  );
}
