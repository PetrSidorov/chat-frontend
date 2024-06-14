import useGetUser from "@/hooks/react-query/useGetUser";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import FullScreenLoading from "./FullScreenLoading";

export default function AuthGuard() {
  const { user, isError, isFetching, error } = useGetUser();
  const location = useLocation();
  const { pathname } = location;

  console.log("isFetching: ", isFetching);
  console.log("isError: ", isError);
  console.log("user: ", user);
  console.log("error: ", error);

  if (isError) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isFetching) {
    return <FullScreenLoading />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if ((user && pathname === "/login") || pathname === "/register") {
    return <Navigate to="/messages" state={{ from: location }} replace />;
  }

  return <Outlet />;
}
