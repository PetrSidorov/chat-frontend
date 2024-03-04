import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import FullScreenLoading from "./FullScreenLoading";

export default function AuthRequired() {
  const { user, isLoaded } = useContext(AuthContext);
  const location = useLocation();

  if (!isLoaded) {
    return <FullScreenLoading />;
  }

  if (user && user.message === "notoken" && location.pathname == "/messages") {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoaded && user && location.pathname === "/") {
    return <Navigate to="/messages" replace />;
  }

  return <Outlet />;
}
