import { useSyncExternalStore } from "react";
import { socket } from "../utils/socket";
import { TOnlineStatuses } from "@/types";

let onlineStatuses: TOnlineStatuses = {};

const updateOnlineStatuses = (convoId: string, onlineUserIds: string[]) => {
  if (onlineUserIds.length === 0) return;
  onlineStatuses = {
    ...onlineStatuses,
    [convoId]: onlineUserIds,
  };
};

const subscribe = (callback: () => void) => {
  const handleUsersOnline = ({
    convoId,
    onlineUserIds,
  }: {
    convoId: string;
    onlineUserIds: string[];
  }) => {
    updateOnlineStatuses(convoId, onlineUserIds);
    callback();
  };

  function handleUserOffline(data) {
    console.log(data);
  }

  socket.on("room:online-users", handleUsersOnline);
  socket.on("room:user-offline", handleUserOffline);

  return () => {
    socket.off("room:online-users", handleUsersOnline);
    socket.off("room:user-offline", handleUserOffline);
  };
};

const getSnapshot = () => onlineStatuses;

export default function useRoomUsersStatus() {
  const currentOnlineStatuses = useSyncExternalStore(subscribe, getSnapshot);

  return currentOnlineStatuses;
}
