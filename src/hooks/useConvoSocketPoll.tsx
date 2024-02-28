import { useContext, useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { AllConvoContext } from "../context/AllConvoContext";
import { AuthContext } from "../context/AuthProvider";

export default function useConvoSocketPoll(): [
  string[],
  (convoId: string) => void
] {
  const [isConnected, setIsConnected] = useState(socket.connected);

  // const { convos, handleOnlineStatuses } =
  //   useContext(AllConvoContext).convoContext;
  const [socketPoll, setSocketPoll] = useContext(AllConvoContext).socketPoll;
  //   const [activeConvoContext, setActiveConvoContext] =
  //     useContext(ActiveConvoContext).convoContext;
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (user && !socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", (error) => {
      console.log("Connection Error:", error);
      setIsConnected(false);
    });

    // Directly update isConnected based on the current socket connection status
    setIsConnected(socket.connected);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
    };
  }, [user]);

  function joinRoom(convoId: string) {
    if (!convoId || !isConnected || socketPoll?.includes(convoId)) return;
    socket.emit("room:join", convoId);
    setSocketPoll((currSocketPoll) => [
      ...new Set([...(currSocketPoll || []), convoId]),
    ]);
  }

  return { socketPoll, joinRoom };
}
