import { Navigate, Outlet } from "react-router-dom";

import { useAppSelector } from "../store/store";
export default function ProtectedRoute() {
  const { userProfile, loading } = useAppSelector((state) => state.auth);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userProfile) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
