import React, { forwardRef, useContext, useEffect, useState } from "react";
import Message from "./message/Message";
import { TMessage, TUser, Tactors } from "../../types";
import MessageContextMenu from "./sidebar/convos/MessageContextMenu";
import { ResizeContext } from "../../context/ResizeProvider";
import { AnimatePresence } from "framer-motion";
import isSameDayAsPreviousMessage from "../../utils/isSameDayAsPreviousMessage";
import MonthAndYear from "./message/MonthAndYear";
import { PopupTrigger } from "@/components/ui/popuptrigger";

const MessageList = forwardRef<
  HTMLDivElement,
  {
    messages: TMessage[];
    currentUser: { username: string; avatarUrl: string | null; id: string };
    handleRemoveMessage: Function;
    activeConvoId: string;
    participants: any;
  }
>(
  (
    { messages, currentUser, handleRemoveMessage, activeConvoId, participants },
    ref
  ) => {
    const [shouldAnimate, setShouldAnimate] = useState(true);
    const { fullWidthMessagesInActiveConvo } = useContext(ResizeContext);

    const messageList = messages.map(
      ({ content, createdAt, sender, id }, i: number, messages) => {
        const yours = sender.id == currentUser.id;

        const avatarUrl = yours
          ? currentUser.avatarUrl
          : participants[0]?.avatarUrl || null;

        const alignment = yours ? "self-start" : "self-end";

        return (
          <React.Fragment key={id}>
            {i === 3 ? <div ref={ref} /> : null}
            {!isSameDayAsPreviousMessage(
              createdAt,
              messages[i - 1]?.createdAt || ""
            ) && (
              <MonthAndYear
                createdAt={createdAt}
                shouldAnimate={shouldAnimate}
              />
            )}
            <div
              id={id}
              className={`${alignment} ${
                fullWidthMessagesInActiveConvo ? "w-full" : "w-[80%]"
              }`}
            >
              <Message
                content={content}
                createdAt={createdAt}
                popup={
                  <MessageContextMenu
                    yours={yours}
                    handleRemoveMessage={() => handleRemoveMessage(id)}
                    id={id}
                  />
                }
                username={sender.username}
                avatarUrl={avatarUrl}
                shouldAnimate={shouldAnimate}
                prevMessageSender={messages[i - 1]?.sender?.username || ""}
              />
            </div>
          </React.Fragment>
        );
      }
    );

    return (
      <>
        <AnimatePresence>{messageList}</AnimatePresence>
      </>
    );
  }
);

export default MessageList;
