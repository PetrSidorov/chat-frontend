import React, { forwardRef, useState } from "react";
import Message from "./message/Message";
import { TMessage, Tactors } from "../../types";
import MessageContextMenu from "./sidebar/convos/MessageContextMenu";
import HandleClickOutside from "../../hooks/useClickOutside";

const MessageList = forwardRef<
  HTMLDivElement,
  {
    messages: TMessage[];
    currentUser: string;
    actors: Tactors;
    handleRemoveMessage: Function;
  }
>(({ messages, currentUser, actors, handleRemoveMessage }, ref) => {
  // const [idForMessageDeletion, setidForMessageDeletion] = useState("");
  const [popupState, setPopupState] = useState({
    show: false,
    top: 0,
    left: 0,
    id: "",
    yours: false,
  });
  function togglePopup(
    yours: boolean,
    id: string,
    e: React.MouseEvent<HTMLElement>,
    forceShow?: boolean
  ) {
    e.preventDefault();
    const left = e.clientX;
    const top = e.clientY;
    // setidForMessageDeletion(id);
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
      const alignment =
        sender.username == currentUser ? "self-end" : "self-start";
      const avatarUrl =
        actors.initiator.username == sender.username
          ? actors.initiator.avatarUrl
          : actors.joiner.avatarUrl;

      const yours = sender.username == currentUser;
      return (
        <React.Fragment key={id}>
          {i === 3 ? <div ref={ref} /> : null}
          <div
            // className="relative"
            onContextMenu={(e) => togglePopup(yours, id, e)}
            onClick={(e) => togglePopup(yours, id, e, false)}
            id={id}
          >
            <Message
              // yours={yours}
              content={content}
              createdAt={createdAt}
              username={sender.username}
              alignment={alignment}
              classes={"w-2/3"}
              avatarUrl={avatarUrl}
              id={id}
              // handleRemoveMessage={() => handleRemoveMessage(id)}
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
});

export default MessageList;
