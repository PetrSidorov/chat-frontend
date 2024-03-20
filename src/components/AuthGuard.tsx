import { useContext, useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthProvider";
import FullScreenLoading from "./FullScreenLoading";

export default function AuthRequired() {
  const { userData, isLoaded } = useContext(AuthContext);
  const location = useLocation();

  if (!isLoaded) {
    return <FullScreenLoading />;
  }

  // useEffect(() => {
  //   console.log("-----");
  //   console.log("isLoaded ", isLoaded);
  //   console.log("user ", user);
  //   console.log("-----");
  // }, [isLoaded, user]);

  // if (!userData && isLoaded) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }

  return <Outlet />;
}
