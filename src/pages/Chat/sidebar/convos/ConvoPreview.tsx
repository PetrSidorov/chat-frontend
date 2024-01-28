import useSockets from "../../../../hooks/useSockets";
import { ConvoProps, TMessage } from "../../../../types";
import Message from "../../message/Message";

export default function ConvoPreview({ messages }: { messages: TMessage[] }) {
  // useSockets(data);

  const notEmptyConvo = messages && messages.length > 0;

  if (notEmptyConvo) {
    let { content, createdAt, sender } = messages[messages.length - 1];

    return (
      <Message
        key={createdAt}
        content={content}
        createdAt={createdAt}
        username={sender?.username}
      />
    );
  } else {
    return (
      <Message
        // createdAt={""}
        content={"This convo is empty, start messaging now =)"}
      />
    );
  }
}
