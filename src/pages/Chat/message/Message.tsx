import { motion } from "framer-motion";
import { TCSSclampLines } from "../../../types";
import { animations } from "../../../utils/animations";
import Avatar from "./Avatar";
import { cn } from "@/lib/utils";

export default function Message({
  content,
  createdAt,
  username,
  avatarUrl,
  showOnlyAvatars = false,
  animationType = "enter",
  style,
  prevMessageSender = "",
}: {
  content: string;
  createdAt: string;
  username: string;
  avatarUrl: string | null;
  showOnlyAvatars?: boolean;
  animationType?: string;
  style?: TCSSclampLines;
  prevMessageSender?: string;
}) {
  const date = createdAt
    ? new Date(createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";
  // const date = createdAt;

  // TODO: ${alignment} ${classes} - gives undefined undefined - fix
  // TODO:   text-overflow: ellipsis (maybe);

  // const animationType = "enter";
  const animation = animations[animationType] || animations.enter;

  const showAvatarAndUsername = prevMessageSender != username;
  // console.log("showAvatarAndUsername ", showAvatarAndUsername);
  // console.log("style ", style);
  // console.log("username ", username);
  return (
    <motion.li
      className={`flex m-2 p-4 bg-gray-200 items-start justify-center`}
      layout
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={animation.transition}
    >
      {showAvatarAndUsername && (
        <Avatar
          showOnlyAvatars={showOnlyAvatars}
          username={username}
          avatarUrl={avatarUrl}
        />
      )}
      {!showOnlyAvatars && (
        <div
          className={cn(
            "ml-2 w-full",
            style ? "overflow-x-hidden" : "whitespace-pre-wrap",
            !showAvatarAndUsername ? "ml-[70px]" : ""
          )}
        >
          <div className="flex justify-between mb-3 flex-nowrap">
            {showAvatarAndUsername && <span className="mr-2">{username}</span>}
            <span className="whitespace-nowrap ml-auto">{date}</span>
          </div>
          <p style={style}>{content}</p>
        </div>
      )}
    </motion.li>
  );
}
