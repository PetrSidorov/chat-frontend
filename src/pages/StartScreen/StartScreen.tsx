import { useContext, useEffect } from "react";
import { TAuthContext } from "../../types";
import { AuthContext } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import FullScreenLoading from "../../components/FullScreenLoading";

export default function StartScreen() {
  const [user, setUser, isLoaded] = useContext<TAuthContext>(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoaded) return;
    if (user) {
      navigate("/messages");
    } else {
      navigate("/login");
    }
  }, [user, navigate]);

  return <FullScreenLoading />;
}
