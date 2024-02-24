import { useContext, useEffect } from "react";
import { TAuthContext } from "../../types";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import FullScreenLoading from "../../components/FullScreenLoading";

export default function StartScreen() {
  // const { user, setUser, isLoaded, error } =
  //   useContext<TAuthContext>(AuthContext);
  // const navigate = useNavigate();

  // useEffect(() => {
  //   if (!isLoaded) return;
  //   if (user?.message == "notoken") {
  //     console.log(user);
  //     navigate("/login");
  //   } else {
  //     navigate("/messages");
  //   }
  // }, [user, navigate]);

  return <FullScreenLoading />;
}
