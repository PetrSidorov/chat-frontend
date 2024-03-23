import { useContext, useEffect, useState } from "react";
import { AllConvoContext } from "../context/AllConvoContext";
import { AuthContext } from "../context/AuthProvider";
import { socket } from "../utils/socket";

export default function useConvoSocketPoll() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketPoll, setSocketPoll] = useContext(AllConvoContext).socketPoll;
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

    setIsConnected(socket.connected);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("room:onlineUsers");
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
