import { motion } from "framer-motion";
import { CircleUserRound } from "lucide-react";
export default function Avatar({
  avatarUrl,
  username,
}: {
  avatarUrl?: string | null;
  username?: string;
}) {
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
        <CircleUserRound
          className="flex-none mx-auto max-w-[100%]"
          size={100}
          strokeWidth={1}
        />
      )}
    </>
  );
}
