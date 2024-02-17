import { TMessage } from "../../../../types";
import Message from "../../message/Message";
import IsOnline from "./IsOnline";

export default function ConvoPreview({
  messages,
  online,
}: {
  messages: TMessage[];
  online: boolean;
}) {
  const notEmptyConvo = messages && messages.length > 0;
  // if (online === undefined) return;
  if (notEmptyConvo) {
    let { content, createdAt, sender } = messages[messages.length - 1];
    // const toChatWith = user
    return (
      <>
        {/* {online && (
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute top-2 right-4"></div>
        )} */}
        <IsOnline online={online} />
        <Message
          key={createdAt}
          content={content}
          createdAt={createdAt}
          username={sender?.username}
        />
      </>
    );
  } else {
    return (
      <Message
        createdAt={""}
        content={"This convo is empty, start messaging now =)"}
      />
    );
  }
}
