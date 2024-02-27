import { motion } from "framer-motion";
import { TCSSclampLines } from "../../../types";
import { animations } from "../../../utils/animations";
import Avatar from "./Avatar";

export default function Message({
  content,
  createdAt,
  username,
  avatarUrl,
  showOnlyAvatars = false,
  animationType = "enter",
  style,
}: {
  content: string;
  createdAt: string;
  username: string;
  avatarUrl: string | null;
  showOnlyAvatars?: boolean;
  animationType?: string;
  style?: TCSSclampLines;
}) {
  const date = createdAt ? new Date(createdAt).toDateString() : "";

  // TODO: ${alignment} ${classes} - gives undefined undefined - fix
  // TODO:   text-overflow: ellipsis (maybe);

  // const animationType = "enter";
  const animation = animations[animationType] || animations.enter;
  // console.log("style ", style);
  return (
    <motion.li
      className="flex items-start m-2 p-4 bg-gray-200"
      layout
      initial={animation.initial}
      animate={animation.animate}
      exit={animation.exit}
      transition={animation.transition}
    >
      <Avatar avatarUrl={avatarUrl} />
      {!showOnlyAvatars && (
        <div className={`ml-2 w-full ${style ? "overflow-x-hidden" : ""}`}>
          <div className="flex justify-between mb-3 flex-nowrap">
            <span className="mr-2">{username}</span>
            <span className="whitespace-nowrap">{date}</span>
          </div>
          <p style={style}>{content}</p>
        </div>
      )}
    </motion.li>
  );
}
