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
    // const initialPopupState = {
    //   show: false,
    //   top: 0,
    //   left: 0,
    //   id: "",
    //   yours: false,
    // };
    // const [popupState, setPopupState] = useState(initialPopupState);
    const [messageToRemove, setMessageToRemove] = useState("");
    const [shouldAnimate, setShouldAnimate] = useState(true);
    // const [animationType, setAnimationType] = useState("enter");
    const { fullWidthMessagesInActiveConvo } = useContext(ResizeContext);

    // useEffect(() => {
    //   // setPopupState(initialPopupState);
    //   setAnimationType("");
    //   setShouldAnimate(false);
    // }, [activeConvoId]);

    // function togglePopup(
    //   yours: boolean,
    //   id: string,
    //   e: React.MouseEvent<HTMLElement>,
    //   forceShow?: boolean
    // ) {
    //   e.preventDefault();
    //   const left = e.clientX;
    //   const top = e.clientY;

    //   setPopupState({
    //     show: forceShow || !popupState.show,
    //     top,
    //     left,
    //     id,
    //     yours,
    //   });
    // }

    // useEffect(() => {
    //   if (messageToRemove) {
    //     setAnimationType("remove");
    //   }
    // }, [messageToRemove]);

    // function handleDismiss() {
    //   setPopupState((curr) => {
    //     return { ...curr, show: false };
    //   });
    // }

    // function handleRemoveMessageAndClose(activeConvoId: string, id: string) {
    //   setShouldAnimate(true);
    //   setMessageToRemove(id);
    //   setTimeout(() => {
    //     handleRemoveMessage(activeConvoId, id);
    //   }, 100);

    //   // handleDismiss();
    // }

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
                yours={yours}
                content={content}
                createdAt={createdAt}
                username={sender.username}
                avatarUrl={avatarUrl}
                // animationType={animationType}
                id={id}
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
