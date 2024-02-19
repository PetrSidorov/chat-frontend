import React, { forwardRef, useContext, useEffect, useState } from "react";
import Message from "./message/Message";
import { TMessage, TUser, Tactors } from "../../types";
import MessageContextMenu from "./sidebar/convos/MessageContextMenu";
import HandleClickOutside from "../../hooks/useClickOutside";
import { ResizeContext } from "../../context/ResizeProvider";

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

    const messageList = messages.map(
      ({ content, createdAt, sender, id }, i: number) => {
        const yours = sender.id! == currentUser.id;
        const avatarUrl = yours ? currentUser.avatarUrl : receiver.avatarUrl;
        const alignment = yours ? "self-end" : "self-start";

        return (
          <React.Fragment key={id}>
            {i === 3 ? <div ref={ref} /> : null}
            <div
              onContextMenu={(e) => togglePopup(yours, id, e)}
              onClick={(e) => togglePopup(yours, id, e, false)}
              id={id}
              className={`w-2/3 ${alignment} ${
                fullWidthMessagesInActiveConvo ? "w-full" : ""
              }`}
            >
              <Message
                content={content}
                createdAt={createdAt}
                username={sender.username}
                avatarUrl={avatarUrl}
              />
            </div>
          </React.Fragment>
        );
      }
    );

    return (
      <>
        {popupState.show && (
          <HandleClickOutside
            callback={() =>
              setPopupState((curr) => {
                return { ...curr, show: false };
              })
            }
          >
            <MessageContextMenu
              yours={popupState.yours}
              handleRemoveMessage={handleRemoveMessage}
              id={popupState.id}
              top={popupState.top}
              left={popupState.left}
            />
          </HandleClickOutside>
        )}
        {messageList}
      </>
    );
  }
);

export default MessageList;
