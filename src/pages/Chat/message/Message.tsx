import { motion } from "framer-motion";
import Avatar from "./Avatar";
import { animations } from "../../../utils/animations";
// import { ActiveConvoContext } from "../../context/ActiveConvoContext";
// import { useContext, useEffect } from "react";

export default function Message({
  content,
  createdAt,
  username,
  avatarUrl,
  showOnlyAvatars = false,
  animationType = "enter",
}: {
  content: string;
  createdAt: string;
  username: string;
  avatarUrl: string | null;
  showOnlyAvatars?: boolean;
  animationType?: string;
}) {
  const date = createdAt ? new Date(createdAt).toDateString() : "";

  // TODO: ${alignment} ${classes} - gives undefined undefined - fix
  // TODO:   text-overflow: ellipsis (maybe);

  // const animationType = "enter";
  const animation = animations[animationType] || animations.enter;

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
        <div className="ml-2 w-full overflow-x-hidden">
          <div className="flex justify-between mb-3">
            <span>{username}</span> <span>{date}</span>
          </div>
          <p>{content}</p>
        </div>
      )}
    </motion.li>
  );
}
