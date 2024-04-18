import { motion } from "framer-motion";
import { TCSSclampLines } from "../../../types";
import { animations } from "../../../utils/animations";
import Avatar from "./Avatar";
import { cn } from "@/lib/utils";
import { PopupTrigger } from "@/components/ui/popuptrigger";
import MessageContextMenu from "../sidebar/convos/MessageContextMenu";
import { useContext } from "react";
import { AllConvoContext } from "@/context/AllConvoProvider";

export default function Message({
  content,
  createdAt,
  username,
  avatarUrl,
  showOnlyAvatars = false,
  popup,
  style,
  prevMessageSender = "",
  shouldAnimate,
}: {
  content: string;
  createdAt: string;
  username: string;
  avatarUrl: string | null;
  showOnlyAvatars?: boolean;
  // animationType?: string;
  style?: TCSSclampLines;
  prevMessageSender?: string;
  shouldAnimate: boolean;
  popup: JSX.Element;
}) {
  const { handleRemoveMessage, animationType } =
    useContext(AllConvoContext).convoContext;
  const date = createdAt
    ? new Date(createdAt).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    : "";

  // TODO: ${alignment} ${classes} - gives undefined undefined - fix
  // TODO:   text-overflow: ellipsis (maybe);

  const animationProps = shouldAnimate
    ? {
        initial: animations[animationType]?.initial,
        animate: animations[animationType]?.animate,
        exit: animations[animationType]?.exit,
        transition: animations[animationType]?.transition,
      }
    : {};
  const showAvatarAndUsername = prevMessageSender != username;

  return (
    <PopupTrigger popup={popup}>
      <motion.li
        // TODO:CSS move this margin up
        className="flex m-2 p-4 bg-gray-200 items-start justify-center"
        layout
        {...animationProps}
      >
        {showAvatarAndUsername && (
          <Avatar
            showOnlyAvatars={showOnlyAvatars}
            username={username}
            avatarUrl={avatarUrl}
            shouldAnimate={shouldAnimate}
            animationType={animationType}
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
              {showAvatarAndUsername && (
                <span className="mr-2">{username}</span>
              )}
              <span className="whitespace-nowrap ml-auto">{date}</span>
            </div>
            <p style={style}>{content}</p>
          </div>
        )}
      </motion.li>
    </PopupTrigger>
  );
}
