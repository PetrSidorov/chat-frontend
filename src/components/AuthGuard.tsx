import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import FullScreenLoading from "./FullScreenLoading";

export default function AuthRequired() {
  const { data, loading, isLoaded } = useContext(AuthContext);
  const location = useLocation();

  if (!isLoaded) {
    return <FullScreenLoading />;
  }

  if (!data && isLoaded) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
