import React, { forwardRef, useContext, useEffect, useState } from "react";
import Message from "./message/Message";
import { TMessage, TUser, Tactors } from "../../types";
import MessageContextMenu from "./sidebar/convos/MessageContextMenu";
import HandleClickOutside from "../../hooks/ClickOutsideHandler";
import { ResizeContext } from "../../context/ResizeProvider";
import { AnimatePresence } from "framer-motion";
import isSameDayAsPreviousMessage from "../../utils/isSameDayAsPreviousMessage";
import MonthAndYear from "./message/MonthAndYear";

const MessageList = forwardRef<
  HTMLDivElement,
  {
    messages: TMessage[];
    currentUser: { username: string; avatarUrl: string | null; id: string };
    handleRemoveMessage: Function;
    activeConvoId: string;
    receiver: TUser;
  }
>(
  (
    { messages, currentUser, receiver, handleRemoveMessage, activeConvoId },
    ref
  ) => {
    const initialPopupState = {
      show: false,
      top: 0,
      left: 0,
      id: "",
      yours: false,
    };
    const [popupState, setPopupState] = useState(initialPopupState);
    // animation related states
    const [messageToRemove, setMessageToRemove] = useState("");

    // animation related states
    const { fullWidthMessagesInActiveConvo } = useContext(ResizeContext);

    useEffect(() => {
      setPopupState(initialPopupState);
    }, [activeConvoId]);

    function togglePopup(
      yours: boolean,
      id: string,
      e: React.MouseEvent<HTMLElement>,
      forceShow?: boolean
    ) {
      e.preventDefault();
      const left = e.clientX;
      const top = e.clientY;

      setPopupState({
        show: forceShow || !popupState.show,
        top,
        left,
        id,
        yours,
      });
    }

    function handleDismiss() {
      setPopupState((curr) => {
        return { ...curr, show: false };
      });
    }

    function handleRemoveMessageAndClose(activeConvoId: string, id: string) {
      setMessageToRemove(id);
      setTimeout(() => {
        handleRemoveMessage(activeConvoId, id);
      }, 0);

      handleDismiss();
    }

    const messageList = messages.map(
      ({ content, createdAt, sender, id }, i: number, messages) => {
        const yours = sender.id == currentUser.id;

        const avatarUrl = yours ? currentUser.avatarUrl : receiver.avatarUrl;
        const alignment = yours ? "self-end" : "self-start";
        let animationType = "";
        if (id === messageToRemove) {
          animationType = "remove";
        }

        return (
          <React.Fragment key={id}>
            {i === 3 ? <div ref={ref} /> : null}
            {!isSameDayAsPreviousMessage(
              createdAt,
              messages[i - 1]?.createdAt || ""
            ) && <MonthAndYear createdAt={createdAt} />}
            <div
              onContextMenu={(e) => togglePopup(yours, id, e)}
              id={id}
              className={`${alignment} ${
                fullWidthMessagesInActiveConvo ? "w-full" : "w-[80%]"
              }`}
            >
              <Message
                content={content}
                createdAt={createdAt}
                username={sender.username}
                avatarUrl={avatarUrl}
                animationType={animationType}
                prevMessageSender={messages[i - 1]?.sender?.username || ""}
              />
            </div>
          </React.Fragment>
        );
      }
    );

    return (
      <>
        {popupState.show && (
          <MessageContextMenu
            yours={popupState.yours}
            handleRemoveMessage={handleRemoveMessageAndClose}
            handleDismiss={handleDismiss}
            id={popupState.id}
            top={popupState.top}
            left={popupState.left}
          />
        )}
        <AnimatePresence>{messageList}</AnimatePresence>
      </>
    );
  }
);

export default MessageList;
