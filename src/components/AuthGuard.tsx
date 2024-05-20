import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import FullScreenLoading from "./FullScreenLoading";

export default function AuthGuard() {
  const { user, status, loading } = useContext(AuthContext);
  const location = useLocation();
  const { hash, pathname, search } = location;

  // TODO: bugfix needed here,
  // redirection from messages to login happens when user is loggedin
  if (loading) {
    return <FullScreenLoading />;
  }

  if (!user || status == 401) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if ((user && pathname == "/login") || pathname == "/register") {
    return <Navigate to="/messages" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
