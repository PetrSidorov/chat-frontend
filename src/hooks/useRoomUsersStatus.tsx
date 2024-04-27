import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { TOnlineStatuses } from "@/types";

export default function useRoomUsersStatus() {
  const [onlineStatuses, setOnlineStatuses] = useState<TOnlineStatuses>({});

  useEffect(() => {
    let subscribed = true;

    const updateOnlineStatuses = (convoId: string, onlineUserIds: string[]) => {
      if (onlineUserIds.length === 0) return;
      if (subscribed) {
        setOnlineStatuses((prevStatuses) => ({
          ...prevStatuses,
          [convoId]: [...onlineUserIds],
        }));
      }
    };

    const setUserOffline = (convoId: string, userId: string) => {
      if (subscribed) {
        setOnlineStatuses((prevStatuses) => {
          const updatedStatuses = { ...prevStatuses };
          if (updatedStatuses[convoId]) {
            updatedStatuses[convoId] = updatedStatuses[convoId].filter(
              (id) => id !== userId
            );
          }
          return updatedStatuses;
        });
      }
    };

    const setUserOnline = (convoId: string, userId: string) => {
      if (subscribed) {
        setOnlineStatuses((prevStatuses) => ({
          ...prevStatuses,
          [convoId]: [...(prevStatuses[convoId] || []), userId],
        }));
      }
    };

    const handleUsersOnline = ({
      convoId,
      onlineUserIds,
    }: {
      convoId: string;
      onlineUserIds: string[];
    }) => {
      console.log("handleUsersOnline (many) ", convoId, onlineUserIds);
      updateOnlineStatuses(convoId, onlineUserIds);
    };

    const handleUserOffline = ({
      userId,
      convoId,
    }: {
      userId: string;
      convoId: string;
    }) => {
      setUserOffline(convoId, userId);
    };

    const handleUserOnline = ({
      userId,
      convoId,
    }: {
      userId: string;
      convoId: string;
    }) => {
      setUserOnline(convoId, userId);
    };

    socket.on("room:online-users", handleUsersOnline);
    socket.on("room:user-offline", handleUserOffline);
    socket.on("room:user-online", handleUserOnline);

    return () => {
      subscribed = false;
      socket.off("room:online-users", handleUsersOnline);
      socket.off("room:user-offline", handleUserOffline);
      socket.off("room:user-online", handleUserOnline);
    };
  }, []);

  return onlineStatuses;
}
