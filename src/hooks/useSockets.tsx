import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
// import ActiveConvoContext from "../context/ActiveConvoContext";

export default function useSockets(): [
  string[],
  (convoId: string | string[]) => void
] {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketPoll, setSocketPoll] = useState<string[]>([]);
  //   const [activeConvoContext, setActiveConvoContext] =
  //     useContext(ActiveConvoContext).convoContext;

  useEffect(() => {
    if (socketPoll.length == 0) return;
    // setSocketPoll((currSocketPoll) => [...currSocketPoll, convoId]);

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
    // console.log(convoId);
    // if (!socketPoll.includes(convoId)) {
    //   socket.emit("id:send", convoId);
    // }

    // socket.on("msg:get", (data) => {
    //   console.log("get ", data);
    //   setActiveConvoContext((activeConvoContext) => {
    //     if (!activeConvoContext) {
    //       return null;
    //     }
    //     return {
    //       ...activeConvoContext,
    //       messages: [...activeConvoContext.messages.slice(0, -1), data],
    //     };
    //   });
    // });
    //   return () => {
    //     socket.off("connect", onConnect);
    //     socket.off("disconnect", onDisconnect);
    //   };
  }, [socketPoll]);

  function addToSocketPoll(convoId: string | string[]) {
    if (typeof convoId == "string") {
      if (!socketPoll.includes(convoId)) {
        socket.emit("id:send", convoId);
      }
      const newSocketPoll = [...socketPoll, convoId];
      setSocketPoll(newSocketPoll);
    }

    // if (Array.isArray(convoId)) {
    //   setSocketPoll((currSocketPoll) => [...currSocketPoll, ...convoId]);
    // }
  }

  return [socketPoll, addToSocketPoll];
}
