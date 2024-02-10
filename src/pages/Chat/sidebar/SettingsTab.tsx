import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthContext";
import UploadAvatar from "./UploadAvatar";

export default function SettingsTab() {
  const [user, setUser] = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState("");

  useEffect(() => {
    const fetchSignedUrl = async () => {
      if (user && user.avatarUrl) {
        try {
          // Now only sending the fileName parameter
          const response = await fetch(
            `http://localhost:3007/api/signed-url?fileName=${encodeURIComponent(
              user.avatarUrl
            )}`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          const data = await response.json();
          console.log(data);
          setAvatarUrl(data.signedUrl);
        } catch (error) {
          console.error("Error fetching signed URL:", error);
        }
      }
    };

    fetchSignedUrl();
  }, [user]);

  return (
    <div>
      <h1 className="text-lg font-bold mb-3">Hi, {user?.username}</h1>
      <p>{user.email}</p>
      {user.name && <p>{user.name}</p>}
      {avatarUrl && <img src={avatarUrl} alt="User Avatar" />}
      <UploadAvatar />
    </div>
  );
}
