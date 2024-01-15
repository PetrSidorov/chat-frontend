import { useContext, useEffect, useRef, useState } from "react";
import { ConvoProps } from "../../types";
import Message from "./Message";
import { socket } from "../../utils/socket";
// import { MessageT } from "../../types";
// import { ConvoContext } from "../../context/ConvoContext";
import { ActiveConvoContext } from "../../context/ActiveConvoContext";
export default function Convo({ data }: ConvoProps) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [activeConvoContext, setActiveConvoContext] =
    useContext(ActiveConvoContext).convoContext;

  const [offset, setOffset] = useContext(ActiveConvoContext).offsetContext;
  const [offsetLoading, setOffsetLoading] =
    useContext(ActiveConvoContext).offsetLoading;

  // useEffect(() => {
  //   if (offsetLoading) {
  //     console.log("test emit");
  //     socket.emit("msg:get-offset", {
  //       offset,
  //       convoId: activeConvoContext?.id,
  //     });
  //     setOffsetLoading(false);
  //   }
  // }, [offsetLoading]);

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
        if (!activeConvoContext) {
          return null;
        }
        return {
          ...activeConvoContext,
          messages: [...activeConvoContext.messages.slice(0, -1), data],
        };
      });
    });

    socket.on("msg:send-offset", (data) => {
      // console.log("msg:send-offset", data.data);
      console.log("hello there");
      setActiveConvoContext((convoContext) => {
        return {
          ...convoContext,
          messages: [...data.data, ...convoContext.messages],
        };
      });
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  // console.log(data, "data fetch");

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
