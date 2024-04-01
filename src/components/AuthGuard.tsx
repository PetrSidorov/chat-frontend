import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import FullScreenLoading from "./FullScreenLoading";

export default function AuthRequired() {
  const { user, status, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <FullScreenLoading />;
  }

  if ((!user && status == 200) || status == 401) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
