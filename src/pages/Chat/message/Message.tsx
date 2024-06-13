import { PopupTrigger } from "@/components/ui/popuptrigger";
import { AllConvoContext } from "@/context/AllConvoProvider";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useContext } from "react";
import { TCSSclampLines } from "../../../types";
import { animations } from "../../../utils/animations";
import Avatar from "./Avatar";

export default function Message({
  content,
  createdAt,
  username,
  avatarUrl,
  showOnlyAvatars = false,
  popup,
  style,
  prevMessageSender = "",
  onMouseEnter,
}: {
  content: string;
  createdAt: string;
  username: string;
  avatarUrl: string | null;
  showOnlyAvatars?: boolean;
  style?: TCSSclampLines;
  prevMessageSender?: string;
  popup: JSX.Element;
  onMouseEnter: () => void;
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

  const animationProps = {
    initial: animations[animationType]?.initial,
    animate: animations[animationType]?.animate,
    exit: animations[animationType]?.exit,
    transition: animations[animationType]?.transition,
    layout: true,
  };

  const showAvatarAndUsername = prevMessageSender != username;

  return (
    <PopupTrigger popup={popup}>
      {/* TODO: the div below was a motion.li, but due to structural changes it can't be no more */}
      {/* i think it shouldn't have been a motio.li from the start, because dealing with animations will be easier now */}
      <div
        // TODO:CSS move this margin up
        className="flex m-2 p-4 bg-gray-200 items-start justify-center"
        // layout
        // {...animationProps}
        onMouseEnter={onMouseEnter}
      >
        {showAvatarAndUsername && (
          <Avatar
            showOnlyAvatars={showOnlyAvatars}
            username={username}
            avatarUrl={avatarUrl}
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
      </div>
    </PopupTrigger>
  );
}
