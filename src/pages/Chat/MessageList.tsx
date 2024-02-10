import React, { forwardRef } from "react";
import Message from "./message/Message";
import { TMessage } from "../../types";

const MessageList = forwardRef<
  HTMLDivElement,
  { messages: TMessage[]; currentUser: string }
>(({ messages, currentUser }, ref) => {
  return messages.map(({ content, createdAt, sender }, i: number) => {
    const alignment =
      sender.username == currentUser ? "self-end" : "self-start";
    return (
      <React.Fragment key={createdAt}>
        {i === 3 ? <div ref={ref} /> : null}
        <Message
          content={content}
          createdAt={createdAt}
          username={sender.username}
          alignment={alignment}
          classes={"w-2/3"}
        />
      </React.Fragment>
    );
  });
});

export default MessageList;
