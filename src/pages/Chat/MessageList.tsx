import React, { forwardRef, useState } from "react";
import Message from "./message/Message";
import { TMessage, Tactors } from "../../types";
import MessageContextMenu from "./sidebar/convos/MessageContextMenu";

const MessageList = forwardRef<
  HTMLDivElement,
  {
    messages: TMessage[];
    currentUser: string;
    actors: Tactors;
    handleRemoveMessage: Function;
  }
>(({ messages, currentUser, actors, handleRemoveMessage }, ref) => {
  // const [show, setShow] = useState(false);
  // function togglePopup() {
  //   setShow((currShow) => !currShow);
  // }
  return messages.map(({ content, createdAt, sender, id }, i: number) => {
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
        // onContextMenu={togglePopup}
        //  onClick={() => handleRemoveMessage(id)}
        >
          {/* {show && <MessageContextMenu yours={yours} />} */}

          <Message
            yours={yours}
            content={content}
            createdAt={createdAt}
            username={sender.username}
            alignment={alignment}
            classes={"w-2/3"}
            avatarUrl={avatarUrl}
            id={id}
            handleRemoveMessage={handleRemoveMessage}
          />
        </div>
      </React.Fragment>
    );
  });
});

export default MessageList;
