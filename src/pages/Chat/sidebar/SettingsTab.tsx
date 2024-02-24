import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../context/AuthProvider";
import UploadAvatar from "./UploadAvatar";
import Avatar from "../message/Avatar";

export default function SettingsTab() {
  const { user } = useContext(AuthContext);

  return (
    <div>
      <h1 className="text-lg font-bold mb-3">Hi, {user?.username}</h1>
      <p>{user?.email}</p>
      {user?.name && <p>{user.name}</p>}
      {user?.avatarUrl && (
        <Avatar username={user?.username} avatarUrl={user?.avatarUrl} />
      )}
      <UploadAvatar />
    </div>
  );
}
