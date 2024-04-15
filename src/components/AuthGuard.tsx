import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import FullScreenLoading from "./FullScreenLoading";

export default function AuthGuard() {
  const { user, status, loading } = useContext(AuthContext);
  const location = useLocation();
  const { hash, pathname, search } = location;

  if (loading) {
    return <FullScreenLoading />;
  }

  // TODO: no need for checking status here
  if ((!user && status == 200) || status == 401) {
    // TODO: if 401 do something meaningful
    // console.log("if ((!user && status == 200) || status == 401) {");

    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if ((user && pathname == "/login") || pathname == "/register") {
    return <Navigate to="/messages" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
