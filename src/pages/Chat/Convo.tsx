import Message from "./Message";
export default function Convo({ data }) {
  // console.log("data", data);
  if (data && data.messages && data.messages.length > 0) {
    const { content, createdAt, sender, id } =
      data.messages[data.messages.length - 1];

    return (
      <Message
        key={id}
        convoId={data.id}
        content={content}
        createdAt={createdAt}
        username={sender?.username}
      />
    );
  } else {
    return;
  }
}
