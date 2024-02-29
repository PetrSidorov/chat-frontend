import { useEffect, useState } from "react";
import { TConvos } from "../types";
import { socket } from "../utils/socket";

export default function useRoomUsersStatus(
  convos: TConvos,
  handleOnlineStatus: Function
) {
  const [changes, setChanges] = useState([]);

  useEffect(() => {
    console.log("convos in  online status ", convos);
  }, [convos]);

  useEffect(() => {
    const handleUserOffline = (convoId: string) => {
      handleOnlineStatus(convoId, false);
      console.log(convoId, false);
    };

    const handleUserOnline = (convoId: string) => {
      handleOnlineStatus(convoId, true);
      console.log(convoId, true);
    };

    socket.on("user:online", handleUserOnline);
    socket.on("user:offline", handleUserOffline);

    return () => {
      socket.off("user:online", handleUserOnline);
      socket.off("user:offline", handleUserOffline);
    };
  }, []);

  return changes;
}
