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

    // console.log("actors.initiator.avatarUrl ", actors.initiator.avatarUrl);
    // console.log("actors.joiner.avatarUrl ", actors.joiner.avatarUrl);

    const avatarUrl =
      actors.initiator.username == sender.username
        ? actors.initiator.avatarUrl
        : actors.joiner.avatarUrl;

    // console.log("avatarUrl ", avatarUrl);
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
        />
      </React.Fragment>
    );
  });
});

export default MessageList;
