import { motion } from "framer-motion";
import { CircleUserRound } from "lucide-react";
// TODO: should show name of the person under avatar,
// when message and date are hidden in preview
export default function Avatar({
  avatarUrl,
  username,
  showOnlyAvatars,
}: {
  avatarUrl?: string | null;
  username?: string;
  showOnlyAvatars?: boolean;
}) {
  const size = showOnlyAvatars ? 80 : 100;
  return (
    <>
      {avatarUrl ? (
        <motion.img
          layout
          className="w-[100px] h-[100px] border-black border-2 rounded-full max-w-[100%]"
          src={avatarUrl}
          alt={username}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div>
          <CircleUserRound
            className="flex-none mx-auto max-w-[100%]"
            size={size}
            strokeWidth={1}
          />
          {showOnlyAvatars && <p className="text-center">{username}</p>}
        </div>
      )}
    </>
  );
}
