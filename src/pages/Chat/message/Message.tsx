import { motion } from "framer-motion";
import Avatar from "./Avatar";
// import { ActiveConvoContext } from "../../context/ActiveConvoContext";
// import { useContext, useEffect } from "react";

export default function Message({
  content,
  createdAt,
  username,
  avatarUrl,
  showOnlyAvatars = false,
  id,
}: {
  content: string;
  createdAt: string;
  username: string;
  avatarUrl: string | null;
  showOnlyAvatars?: boolean;
  id: string;
}) {
  const date = createdAt ? new Date(createdAt).toDateString() : "";

  // TODO: ${alignment} ${classes} - gives undefined undefined - fix
  // TODO:   text-overflow: ellipsis (maybe);

  return (
    <motion.li
      className="flex items-start m-2 p-4 bg-gray-200"
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5 }}
    >
      <Avatar avatarUrl={avatarUrl} />
      {!showOnlyAvatars && (
        <div className="ml-2 w-full overflow-x-hidden">
          <div className="flex justify-between mb-3">
            <span>{username}</span> <span>{date}</span>
            {/* <span>{id}</span> */}
          </div>
          <p>{content}</p>
        </div>
      )}
    </motion.li>
  );
}
