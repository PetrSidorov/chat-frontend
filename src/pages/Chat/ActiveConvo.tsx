import { ActiveConvoContext } from "../../context/ActiveConvoContext";
import { useContext, useEffect, useState } from "react";
import fetchDB from "../../utils/fetchDB";
import Message from "./Message";
export default function ActiveConvo(data) {
  const [activeConvo, _] = useContext(ActiveConvoContext);
  const [messagesData, setMessages] = useState(null);

  useEffect(() => {
    fetchDB({
      method: "GET",
      url: `http://localhost:3007/api/messages/${activeConvo}`,
    }).then((data) => setMessages(data.data));
  }, [activeConvo]);
  //   const messages = "test";
  const messages = messagesData?.map(({ content, createdAt, sender, id }) => (
    <Message
      key={id}
      content={content}
      createdAt={createdAt}
      username={sender.username}
    />
  ));
  return messages || null;
}
