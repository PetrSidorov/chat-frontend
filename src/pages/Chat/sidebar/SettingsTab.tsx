import axios from "axios";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../../context/AuthProvider";
import { socket } from "../../../utils/socket";
import Avatar from "../message/Avatar";
import UploadAvatar from "./UploadAvatar";

export default function SettingsTab() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  async function logout() {
    //TODO: check this for actual working
    // TODO:TYPESCRIPT
    const response = await axios.post(
      "http://localhost:3007/logout",
      {},
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.status == 200) {
      navigate("/login");
      if (socket) socket.disconnect();
    }
  }
  // TODO:CSS move this margin up

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Hi, {user?.username}</h1>
      <button
        onClick={logout}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Logout
      </button>
      <div className="text-gray-700">
        <p>Email: {user?.email}</p>
        {user?.name && <p>Name: {user?.name}</p>}
      </div>
      {user?.avatarUrl && (
        <div className="mt-4">
          <Avatar username={user?.username} avatarUrl={user?.avatarUrl} />
        </div>
      )}
      <div className="mt-4">
        <UploadAvatar />
      </div>
    </div>
  );
}
