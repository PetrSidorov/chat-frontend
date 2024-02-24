import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import FullScreenLoading from "./FullScreenLoading";

export default function AuthRequired() {
  const { user, loading, isLoaded } = useContext(AuthContext);
  const location = useLocation();

  useEffect(() => {
    console.log("user, loading, isLoaded ", user, loading, isLoaded);
  }, [user, loading]);

  if (!isLoaded) {
    console.log("fullscreenload");
    return <FullScreenLoading />;
  }

  if (!user && isLoaded) {
    console.log("navigate login");
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  console.log("outlet");
  return <Outlet />;
}
