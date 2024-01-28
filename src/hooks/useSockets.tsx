import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
// import ActiveConvoContext from "../context/ActiveConvoContext";
import { ConvoProps } from "../types";

export default function useSockets(data: ConvoProps) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  //   const [activeConvoContext, setActiveConvoContext] =
  //     useContext(ActiveConvoContext).convoContext;
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
      console.log("get ", data);
      //   setActiveConvoContext((activeConvoContext) => {
      //     if (!activeConvoContext) {
      //       return null;
      //     }
      //     return {
      //       ...activeConvoContext,
      //       messages: [...activeConvoContext.messages.slice(0, -1), data],
      //     };
      //   });
    });
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);
}
