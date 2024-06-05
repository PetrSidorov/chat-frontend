import { animations } from "@/utils/animations";
import { motion } from "framer-motion";
import { CircleUserRound } from "lucide-react";
import usernameToHexColor from "@/utils/usernameToHexColor";
import { cn } from "@/utils/cn";
// TODO: should show name of the person under avatar,
// when message and date are hidden in preview
export default function Avatar({
  avatarUrl,
  username,
  showOnlyAvatars,
  animationType,
}: {
  avatarUrl?: string | null;
  username?: string;
  showOnlyAvatars?: boolean;
  animationType: string;
}) {
  // const size = showOnlyAvatars ? 92 : 92;
  // TODO: optimize this, there's no need to recalculate it every time
  const bgColor = usernameToHexColor(username);
  return (
    <>
      {avatarUrl ? (
        // <motion.img
        //   layout
        //   {...animationProps}
        //   className="min-w-[70px] w-[70px] h-[70px] border-black border-2 rounded-full max-w-[100%]"
        //   src={avatarUrl}
        //   alt={username}
        //   style={{ objectFit: "cover" }}
        // />
        <img
          // layout
          // {...animationProps}
          className="min-w-[70px] w-[70px] h-[70px] border-black border-2 rounded-full max-w-[100%]"
          src={avatarUrl}
          alt={username}
          style={{ objectFit: "cover" }}
        />
      ) : (
        <div>
          <div
            className="min-w-[70px] w-[70px] h-[70px] rounded-full flex border-black border-2"
            style={{ backgroundColor: bgColor }}
          >
            <p className="m-auto text-2xl font-semibold">
              {username!.slice(0, 1).toUpperCase()}
            </p>
          </div>
        </div>
      )}
    </>
  );
}
