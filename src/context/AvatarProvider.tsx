import { ReactNode, useState } from "react";

import { createContext } from "react";
import { generateFetchAvatar } from "../utils/fetchAvatar";

export const AvatarContext = createContext<null>(null);

export default function AvatarProvider({ children }: { children: ReactNode }) {
  const [avatars, setAvatars] = useState<{ string: string } | {}>({});
  const fetchAvatar = generateFetchAvatar();

  const handleAvatar = async (userId: string, avatarUrl: string) => {
    if (!userId || !avatarUrl) return;
    const signedUrl = await fetchAvatar(avatarUrl);
    setAvatars((avatarPoll) => {
      return { ...avatarPoll, [userId]: signedUrl };
    });
  };

  return (
    <AvatarContext.Provider value={[avatars, handleAvatar]}>
      {children}
    </AvatarContext.Provider>
  );
}
