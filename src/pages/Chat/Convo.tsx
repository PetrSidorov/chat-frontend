import { useContext, useEffect, useState } from "react";
import Message from "./Message";
import { socket } from "../../utils/socket";
// import { MessageT } from "../../types";
// import { ConvoContext } from "../../context/ConvoContext";
import { ActiveConvoContext } from "../../context/ActiveConvoContext";
export default function Convo({ data }) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [activeConvoContext, setActiveConvoContext] =
    useContext(ActiveConvoContext);
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

    socket.emit("id:send", data.id);

    socket.on("msg:get", (data) => {
      // console.log("server says hi ", data);
      setActiveConvoContext((activeConvoContext) => {
        return {
          ...activeConvoContext,
          messages: [...activeConvoContext.messages.slice(0, -1), data],
        };
      });
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  console.log(data, "data fetch");

  if (data && data.messages && data.messages.length > 0) {
    let { content, createdAt, sender } =
      data.messages[data.messages.length - 1];

    return (
      <Message
        key={createdAt}
        content={content}
        createdAt={createdAt}
        username={sender?.username}
      />
    );
  } else {
    return;
  }
}
