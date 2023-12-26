import { ActiveConvoContext } from "../../context/ActiveConvoContext";
import { useContext, useEffect, useState } from "react";
import { socket } from "../../utils/socket";
import fetchDB from "../../utils/fetchDB";
import Message from "./Message";
export default function ActiveConvo(data) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [activeConvo, _] = useContext(ActiveConvoContext);
  const [messagesData, setMessages] = useState(null);

  useEffect(() => {
    function onConnect() {
      console.log("socket connect");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("socket disconnect");
      setIsConnected(false);
    }

    socket.on("connect_error", (error) => {
      console.log("Connection Error:", error);
    });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

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
