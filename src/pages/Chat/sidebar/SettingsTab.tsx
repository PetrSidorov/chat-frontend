import { useContext, useEffect } from "react";
import { AuthContext } from "../../../context/AuthContext";
import useFetchDB from "../../../hooks/useFetchDB";
export default function SettingsTab() {
  const [user, setUser] = useContext(AuthContext);
  console.log("user: ", user);
  // const { loading, data, error, setFetchData } = useFetchDB<any>();
  // useEffect(() => {
  //   if (!user) {
  //     setFetchData({
  //       url: "http://localhost:3007/api/user-data",
  //       method: "GET",
  //     });
  //   }
  // }, [user]);

  // useEffect(() => {
  //   if (data) {
  //     setUser(data.user);
  //   }
  // }, [data]);
  return <h1 className="text-lg font-bold mb-3">Hi, {user?.username}</h1>;
}
