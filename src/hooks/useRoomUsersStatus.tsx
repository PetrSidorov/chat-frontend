import { useSyncExternalStore } from "react";
import { socket } from "../utils/socket";
import { TOnlineStatuses } from "@/types";

let onlineStatuses: TOnlineStatuses = {};

const updateOnlineStatuses = (convoId: string, onlineUserIds: string[]) => {
  if (onlineUserIds.length === 0) return;
  onlineStatuses = {
    ...onlineStatuses,
    [convoId]: [...onlineUserIds],
  };
};

const setUserOffline = (convoId: string, userId: string) => {
  onlineStatuses[convoId] = onlineStatuses[convoId] || [];
  const filteredUserIds = onlineStatuses[convoId].filter((id) => id !== userId);
  onlineStatuses = {
    ...onlineStatuses,
    [convoId]: filteredUserIds,
  };
};

const setUserOnline = (convoId: string, userId: string) => {
  onlineStatuses[convoId] = onlineStatuses[convoId] || [];
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
    console.log("hello new users ", onlineUserIds);
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
    console.log("actual user online ", convoId, userId);
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

// useffect implemntation below
// import { useState, useEffect } from "react";
// import { socket } from "../utils/socket";
// import { TOnlineStatuses } from "@/types";

// export default function useRoomUsersStatus() {
//   const [onlineStatuses, setOnlineStatuses] = useState<TOnlineStatuses>({});

//   useEffect(() => {
//     const updateOnlineStatuses = (convoId: string, onlineUserIds: string[]) => {
//       if (onlineUserIds.length === 0) return;
//       setOnlineStatuses((prevStatuses) => ({
//         ...prevStatuses,
//         [convoId]: [...onlineUserIds],
//       }));
//     };

//     const setUserOffline = (convoId: string, userId: string) => {
//       setOnlineStatuses((prevStatuses) => {
//         const filteredUserIds =
//           prevStatuses[convoId]?.filter((id) => id !== userId) || [];
//         return {
//           ...prevStatuses,
//           [convoId]: filteredUserIds,
//         };
//       });
//     };

//     const setUserOnline = (convoId: string, userId: string) => {
//       setOnlineStatuses((prevStatuses) => {
//         const updatedUserIds = prevStatuses[convoId]
//           ? [...prevStatuses[convoId], userId]
//           : [userId];
//         return {
//           ...prevStatuses,
//           [convoId]: updatedUserIds,
//         };
//       });
//     };

//     const handleUsersOnline = ({
//       convoId,
//       onlineUserIds,
//     }: {
//       convoId: string;
//       onlineUserIds: string[];
//     }) => {
//       console.log("hello new users ", onlineUserIds);
//       updateOnlineStatuses(convoId, onlineUserIds);
//     };

//     const handleUserOffline = ({
//       userId,
//       convoId,
//     }: {
//       userId: string;
//       convoId: string;
//     }) => {
//       setUserOffline(convoId, userId);
//     };

//     const handleUserOnline = ({
//       userId,
//       convoId,
//     }: {
//       userId: string;
//       convoId: string;
//     }) => {
//       setUserOnline(convoId, userId);
//     };

//     socket.on("room:online-users", handleUsersOnline);
//     socket.on("room:user-offline", handleUserOffline);
//     socket.on("room:user-online", handleUserOnline);

//     // Cleanup on unmount
//     return () => {
//       socket.off("room:online-users", handleUsersOnline);
//       socket.off("room:user-offline", handleUserOffline);
//       socket.off("room:user-online", handleUserOnline);
//     };
//   }, []);

//   return onlineStatuses;
// }
