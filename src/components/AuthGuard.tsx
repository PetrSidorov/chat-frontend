import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import FullScreenLoading from "./FullScreenLoading";

export default function AuthRequired() {
  const { user, status, loading } = useContext(AuthContext);
  const location = useLocation();

  if (!loading && status != 200) {
    return <FullScreenLoading />;
  }

  if (!user && !loading && status == 200) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
