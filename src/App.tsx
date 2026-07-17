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

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Footer from "./components/Footer";
import Profile from "./components/Profile";
import DashboardLayout from "./components/DashboardLayout";
import Contact from "./components/Contact";
import About from "./components/About";
import Pricing from "./components/Pricing";
import NotFound from "./components/NotFound";
import PublicRoute from "./components/PublicRoute";
import ProtectedRoute from "./components/PrivateRoute";

const Overview = lazy(() => import("./components/DashboardOverview"));
const Tasks = lazy(() => import("./components/DashboardTasks"));
const DashboardAdmin = lazy(() => import("./components/DashboardAdmin"));

export default function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const hideFooter = ["/login", "/register"].includes(location.pathname);
  const hideLayout = location.pathname.startsWith("/dashboard");
  const { userProfile, loading } = useAppSelector((state) => state.auth);
  useEffect(() => {
    const unsubscribeAuth = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userRef = ref(db, `users/${user.uid}`);
        onValue(userRef, (snapshot) => {
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

    return () => unsubscribeAuth();
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
      {!hideLayout && !hideFooter && <Footer />}
    </div>
  );
}
