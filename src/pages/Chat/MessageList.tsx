import React, { forwardRef } from "react";
import Message from "./message/Message";
import { TMessage } from "../../types";

const MessageList = forwardRef<HTMLDivElement, { messages: TMessage[] }>(
  ({ messages }, ref) => {
    return messages.map(({ content, createdAt, sender }, i: number) => {
      return (
        <React.Fragment key={createdAt}>
          {i === 3 ? <div ref={ref} /> : null}
          <Message
            content={content}
            createdAt={createdAt}
            username={sender.username}
          />
        </React.Fragment>
      );
    });
  }
);

export default MessageList;
