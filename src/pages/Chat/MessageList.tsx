import React, { forwardRef } from "react";
import Message from "./message/Message";
import { TMessage, Tactors } from "../../types";

const MessageList = forwardRef<
  HTMLDivElement,
  { messages: TMessage[]; currentUser: string; actors: Tactors }
>(({ messages, currentUser, actors }, ref) => {
  return messages.map(({ content, createdAt, sender }, i: number) => {
    const alignment =
      sender.username == currentUser ? "self-end" : "self-start";
    const avatarUrl =
      actors.initiator.username == sender.username
        ? actors.initiator.avatarUrl
        : actors.joiner.avatarUrl;
    const avatar =
      actors.initiator.username == sender.username
        ? actors.initiator.avatar
        : actors.joiner.avatar;

    return (
      <React.Fragment key={createdAt}>
        {i === 3 ? <div ref={ref} /> : null}
        <Message
          content={content}
          createdAt={createdAt}
          username={sender.username}
          alignment={alignment}
          classes={"w-2/3"}
          avatarUrl={avatarUrl}
          avatar={avatar}
        />
      </React.Fragment>
    );
  });
});

export default MessageList;
