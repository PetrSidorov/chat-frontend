// import { useSyncExternalStore } from "react";
// import { socket } from "../utils/socket";
// import { TOnlineStatuses } from "@/types";

// let onlineStatuses: TOnlineStatuses = {};

// const updateOnlineStatuses = (convoId: string, onlineUserIds: string[]) => {
//   if (onlineUserIds.length === 0) return;
//   onlineStatuses = {
//     ...onlineStatuses,
//     [convoId]: [...onlineUserIds],
//   };
// };

// const setUserOffline = (convoId: string, userId: string) => {
//   onlineStatuses[convoId] = onlineStatuses[convoId] || [];
//   const filteredUserIds = onlineStatuses[convoId].filter((id) => id !== userId);
//   onlineStatuses = {
//     ...onlineStatuses,
//     [convoId]: filteredUserIds,
//   };
// };

// const setUserOnline = (convoId: string, userId: string) => {
//   onlineStatuses[convoId] = onlineStatuses[convoId] || [];
//   const updatedUserIds = [...onlineStatuses[convoId], userId];
//   onlineStatuses = {
//     ...onlineStatuses,
//     [convoId]: updatedUserIds,
//   };
// };

// const subscribe = (callback: () => void) => {
//   const handleUsersOnline = ({
//     convoId,
//     onlineUserIds,
//   }: {
//     convoId: string;
//     onlineUserIds: string[];
//   }) => {
//     console.log("handleUsersOnline ", onlineUserIds);
//     updateOnlineStatuses(convoId, onlineUserIds);
//     callback();
//   };

//   function handleUserOffline({
//     userId,
//     convoId,
//   }: {
//     userId: string;
//     convoId: string;
//   }) {
//     setUserOffline(convoId, userId);
//     callback();
//   }

//   function handleUserOnline({
//     userId,
//     convoId,
//   }: {
//     userId: string;
//     convoId: string;
//   }) {
//     console.log("actual user online ", convoId, userId);
//     setUserOnline(convoId, userId);
//     callback();
//   }

//   socket.on("room:online-users", handleUsersOnline);
//   socket.on("room:user-offline", handleUserOffline);
//   socket.on("room:user-online", handleUserOnline);

//   return () => {
//     socket.off("room:online-users", handleUsersOnline);
//     socket.off("room:user-offline", handleUserOffline);
//     socket.off("room:user-online", handleUserOnline);
//   };
// };

// const getSnapshot = () => onlineStatuses;

// export default function useRoomUsersStatus() {
//   const currentOnlineStatuses = useSyncExternalStore(subscribe, getSnapshot);
//   return currentOnlineStatuses;
// }

// useffect implemntation below

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
      console.log("handleUsersOffline ", convoId, convoId);
      setUserOffline(convoId, userId);
    };

    const handleUserOnline = ({
      userId,
      convoId,
    }: {
      userId: string;
      convoId: string;
    }) => {
      console.log("handleUserOnline (one) ", userId, convoId);
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
