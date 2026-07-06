import { useEffect } from "react";
import { auth, db } from "./utils/firebaseConfig";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { ref, onValue } from "firebase/database";
import { Routes, Route, useNavigate, useLocation } from "react-router-dom";
import { useAppDispatch } from "./store/store";
import { useAppSelector } from "./store/store";
import { setProfile, clearProfile } from "./store/authSlice";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Footer from "./components/Footer";

export default function App() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();
  const hideFooter = ["/login", "/register"].includes(location.pathname);
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
      <Navbar userProfile={userProfile} onLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
      {!hideFooter && <Footer />}
    </div>
  );
}
