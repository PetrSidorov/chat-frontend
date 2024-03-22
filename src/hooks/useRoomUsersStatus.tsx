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

const setUserOffline = (convoId: string, userId: string) => {
  const filtereUserIds = onlineStatuses[convoId].filter((id) => id !== userId);
  onlineStatuses = {
    ...onlineStatuses,
    [convoId]: filtereUserIds,
  };
};

const setUserOnline = (convoId: string, userId: string) => {
  const updatedUserIds = [...onlineStatuses[convoId], userId];
  onlineStatuses = {
    ...onlineStatuses,
    [convoId]: updatedUserIds,
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

  function handleUserOffline({
    userId,
    convoId,
  }: {
    userId: string;
    convoId: string;
  }) {
    setUserOffline(convoId, userId);
    callback();
  }

  function handleUserOnline({
    userId,
    convoId,
  }: {
    userId: string;
    convoId: string;
  }) {
    console.log("convoId, userId ", convoId, userId);
    setUserOnline(convoId, userId);
    callback();
  }

  socket.on("room:online-users", handleUsersOnline);
  socket.on("room:user-offline", handleUserOffline);
  socket.on("room:user-online", handleUserOnline);

  return () => {
    socket.off("room:online-users", handleUsersOnline);
    socket.off("room:user-offline", handleUserOffline);
    socket.off("room:user-online", handleUserOnline);
  };
};

const getSnapshot = () => onlineStatuses;

export default function useRoomUsersStatus() {
  const currentOnlineStatuses = useSyncExternalStore(subscribe, getSnapshot);

  return currentOnlineStatuses;
}
