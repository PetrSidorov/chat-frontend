import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import UploadAvatar from "./UploadAvatar";
import { generateFetchAvatar } from "../../../utils/fetchAvatar";
import Avatar from "../message/Avatar";

export default function SettingsTab() {
  const [user, setUser] = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState("");
  const fetchAvatar = fetchAvatar();

  useEffect(() => {
    const handleAvatar = async () => {
      if (!user || !user.avatarUrl) return;
      const signedUrl = await fetchAvatar(user.avatarUrl);
      setAvatarUrl(signedUrl);
    };
    handleAvatar();
  }, [user]);

  return (
    <div>
      <h1 className="text-lg font-bold mb-3">Hi, {user?.username}</h1>
      <p>{user.email}</p>
      {user.name && <p>{user.name}</p>}
      {avatarUrl && (
        // <img className="w-[120px]" src={avatarUrl} alt="User Avatar" />
        <Avatar username={user?.username} avatarUrl={avatarUrl} />
      )}
      <UploadAvatar />
    </div>
  );
}
