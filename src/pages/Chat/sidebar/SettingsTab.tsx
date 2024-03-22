import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import UploadAvatar from "./UploadAvatar";
import Avatar from "../message/Avatar";
import useFetchDB from "../../../hooks/useFetchDB";
import { TLoginDataBaseResponse } from "../../../types";
import { useNavigate } from "react-router-dom";
import { socket } from "../../../utils/socket";
// TODO: when this tab or /friends tab is reloaded
// i get redirected to messages component but url stays the same
// and basically the whole thing gets broken
export default function SettingsTab() {
  const { user } = useContext(AuthContext);
  const { loading, data, error, setFetchData, isLoaded } =
    useFetchDB<TLoginDataBaseResponse | null>();
  const navigate = useNavigate();

  function logout() {
    setFetchData({
      url: "http://localhost:3007/logout",
      method: "POST",
    });

    // TODO: if there is response
    // navigate("/login");
  }

  useEffect(() => {
    if (data?.message == "loggedout") {
      navigate("/login");
      if (socket) socket.disconnect();
    }
  }, [data]);

  return (
    <div>
      <h1 className="text-lg font-bold mb-3">Hi, {user?.username}</h1>
      <button onClick={() => logout()}>Logout</button>
      <p>{user?.email}</p>
      {user?.name && <p>{user.name}</p>}
      {user?.avatarUrl && (
        <Avatar username={user?.username} avatarUrl={user?.avatarUrl} />
      )}
      <UploadAvatar />
    </div>
  );
}
