import { useEffect, useState } from "react";
import { socket } from "../utils/socket";
import { TOnlineStatuses } from "@/types";

export default function useRoomUsersStatus() {
  const [onlineStatuses, setOnlineStatuses] = useState<TOnlineStatuses>({});

  useEffect(() => {
    const handleUsersOnline = ({
      convoId,
      onlineUserIds,
    }: {
      convoId: string;
      onlineUserIds: string[];
    }) => {
      console.log("convoId, onlineUserIds ", convoId, onlineUserIds);
      setOnlineStatuses((currentStatuses) => {
        const updatedConvoStatus = onlineUserIds.reduce<{
          [userId: string]: boolean;
        }>((acc, userId) => {
          acc[userId] = true;
          return acc;
        }, {});

        const updatedStatuses: TOnlineStatuses = {
          ...currentStatuses,
          [convoId]: updatedConvoStatus,
        };
        console.log("updatedStatuses ", updatedStatuses);
        return updatedStatuses;
      });
    };

    socket.on("room:online-users", handleUsersOnline);

    return () => {
      socket.off("room:online-users", handleUsersOnline);
    };
  }, []);

  return onlineStatuses;
}
