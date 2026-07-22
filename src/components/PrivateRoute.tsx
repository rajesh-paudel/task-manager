import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../store/store";
export default function ProtectedRoute() {
  const { userProfile, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-6 w-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return userProfile ? <Outlet /> : <Navigate to="/login" />;
}
