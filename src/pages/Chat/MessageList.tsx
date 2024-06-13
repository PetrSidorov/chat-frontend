// TODO: remove me
import { AnimatePresence } from "framer-motion";
import React, { forwardRef, useContext } from "react";
import { ResizeContext } from "../../context/ResizeProvider";
import { TMessage } from "../../types";
import isSameDayAsPreviousMessage from "../../utils/isSameDayAsPreviousMessage";
import Message from "./message/Message";
import MonthAndYear from "./message/MonthAndYear";
import MessageContextMenu from "./sidebar/convos/MessageContextMenu";
import { AllConvoContext } from "@/context/AllConvoProvider";

const MessageList = forwardRef<
  HTMLDivElement,
  {
    messages: TMessage[];
    currentUser: { username: string; avatarUrl: string | null; id: string };
    handleRemoveMessage: Function;
    activeConvoId: string;
    // participants: any;
  }
>(
  (
    {
      messages,
      currentUser,
      handleRemoveMessage,
      activeConvoId,
      // participants
    },
    ref
  ) => {
    const { fullWidthMessagesInActiveConvo } = useContext(ResizeContext);

    const messageList = messages.map(
      ({ content, createdAt, sender, uuid }, i: number, messages) => {
        const yours = sender.id == currentUser.id;

        // const avatarUrl = yours
        //   ? currentUser.avatarUrl
        //   : participants[0]?.avatarUrl || null;
        const avatarUrl = currentUser.avatarUrl;

        const alignment = yours ? "self-start" : "self-end";

        return (
          <React.Fragment key={uuid}>
            {i === 3 ? <div ref={ref} /> : null}
            {!isSameDayAsPreviousMessage(
              createdAt,
              messages[i - 1]?.createdAt || ""
            ) && <MonthAndYear createdAt={createdAt} />}
            <div
              id={uuid}
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
                    content={content}
                    handleRemoveMessage={() => handleRemoveMessage(uuid)}
                    uuid={uuid}
                  />
                }
                username={sender.username}
                avatarUrl={avatarUrl}
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
