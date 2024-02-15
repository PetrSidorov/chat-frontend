import { useContext, useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { AllConvoContext } from "../context/AllConvoContext";

export default function useConvoSocketPoll(): [
  string[],
  (convoId: string, companionId: string) => void
] {
  const [isConnected, setIsConnected] = useState(socket.connected);

  const { convos, handleOnlineStatuses } =
    useContext(AllConvoContext).convoContext;
  const [socketPoll, setSocketPoll] = useContext(AllConvoContext).socketPoll;
  //   const [activeConvoContext, setActiveConvoContext] =
  //     useContext(ActiveConvoContext).convoContext;

  useEffect(() => {
    if (!socketPoll || socketPoll.length == 0) return;
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
    socket.on("online-statuses:return", (onlineStatusMap) => {
      const [convoId] = Object.keys(onlineStatusMap);
      const online = onlineStatusMap[convoId];
      handleOnlineStatuses(convoId, online);
    });
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

  function addConvoToSocketPoll(convoId: string, companionId: string) {
    if (!convoId || !companionId) return;
    // console.log("userId ", companionId);
    socket.emit("id:send", { convoId, companionId });
    // console.log(convoId);
    setSocketPoll((currSocketPoll) => {
      return currSocketPoll ? [...currSocketPoll, convoId] : [convoId];
    });
  }

  return [socketPoll, addConvoToSocketPoll];
}
