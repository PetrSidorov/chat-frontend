import Message from "./Message";
export default function Convo({ data }) {
  console.log("convoz data", data);
  if (data && data.messages && data.messages.length > 0) {
    const { initiator, joiner, currUserId } = data;
    const { content, createdAt, sender, id } =
      data.messages[data.messages.length - 1];
    return (
      <Message
        key={id}
        convoId={data.id}
        content={content}
        createdAt={createdAt}
        username={sender?.username}
        initiator={initiator.username}
        joiner={joiner.username}
        initiatorId={initiator.id}
        joinerId={joiner.id}
        currUserId={currUserId}
      />
    );
  } else {
    return;
  }
}
