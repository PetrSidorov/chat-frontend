import useRoomUsersStatus from "@/hooks/useRoomUsersStatus";
import { ReactNode, createContext, useEffect, useState } from "react";
import { TConvoContext, TConvos, TMessage } from "../types";
import { socket } from "../utils/socket";

export const AllConvoContext = createContext<TConvoContext>(null);

export default function ActiveConvoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [animationType, setAnimationType] = useState("enter");

  const [convos, setConvos] = useState<TConvos | null>(null);
  const [activeConvoId, setActiveConvoId] = useState<string>("");
  const onlineStatuses = useRoomUsersStatus();

  const [socketPoll, setSocketPoll] = useState<string[] | null>(null);

  useEffect(() => {
    console.log("animationType: ", animationType);
  }, [animationType]);

  // useEffect(() => {
  //   async function socketConnectionHandler() {
  //     try {
  //       await waitForSocketConnection();
  //     } catch (e) {
  //       console.error(e);
  //     }
  //   }

  //   socketConnectionHandler();
  // }, []);

  // function waitForSocketConnection() {
  //   console.log("waitForSocketConnection");
  //   return new Promise((resolve, reject) => {
  //     const onConnect = () => {
  //       socket.off("connect", onConnect);
  //       socket.off("connect_error", onConnectError);
  //       resolve(null);
  //     };
  //     const onConnectError = (error: any) => {
  //       socket.off("connect", onConnect);
  //       socket.off("connect_error", onConnectError);
  //       reject(error);
  //     };

  //     if (socket.connected) {
  //       resolve(null);
  //     } else {
  //       socket.on("connect", onConnect);
  //       socket.on("connect_error", onConnectError);
  //       socket.connect();
  //     }
  //   });
  // }

  async function joinRoom(convoId: string) {
    console.log("Attempting to join room", convoId);
    console.log("socketPoll is ", socketPoll);
    // if (!convoId || socketPoll?.includes(convoId)) return;

    try {
      //await waitForSocketConnection();

      socket.emit("room:join", convoId);
      setSocketPoll((currSocketPoll) => [
        ...new Set([...(currSocketPoll || []), convoId]),
      ]);
    } catch (error) {
      console.log("Failed to connect to socket:", error);
    }
  }

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("socket connected!!!!");
    });
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
  }, []);

  useEffect(() => {
    const handleMessageReturn = (
      incomingMessage: TMessage & { convoId: string }
    ) => {
      setAnimationType("enter");
      if (incomingMessage && incomingMessage.convoId === activeConvoId) {
        setConvos((currentConvos) => {
          // This should never happen, but
          // this check is required
          if (!currentConvos) return null;
          const updatedConvos = { ...currentConvos };
          const convoId = incomingMessage.convoId;
          const message = incomingMessage;
          if (updatedConvos[convoId]) {
            updatedConvos[convoId].messages = [
              ...(updatedConvos[convoId].messages || []),
              message,
            ];
          } else {
            updatedConvos[convoId] = { messages: [message] };
          }
          return updatedConvos;
        });
      }
    };

    socket.on("msg:return", handleMessageReturn);
    socket.on("msg:delete:return", handleMessageDelete);

    return () => {
      socket.off("msg:return", handleMessageReturn);
      socket.off("msg:delete:return", handleMessageDelete);
    };
  }, [activeConvoId]);

  const initConvo = (data: TConvos) => {
    setConvos(data);
    console.log("data in init convo ", Object.keys(data));
    Object.keys(data).forEach(joinRoom);
  };

  const handleActiveConvoId = (id: string) => {
    console.log("handleActiveConvoId is called");
    if (activeConvoId === id) return;
    setActiveConvoId(id);
  };

  function handleMessageDelete({
    id: messageToDelete,
    convoId,
  }: {
    id: string;
    convoId: string;
  }) {
    setConvos((currConvos) => {
      const updatedConvos = { ...currConvos };
      if (updatedConvos[convoId]) {
        const updatedMessages = updatedConvos[convoId].messages.filter(
          ({ id }) => id !== messageToDelete
        );
        updatedConvos[convoId].messages = updatedMessages;
        return updatedConvos;
      }
      // The line below exists for
      // typescript error fixing
      return currConvos;
    });
  }

  const handleRemoveMessage = (messageIdToDelete: string) => {
    // TODO: optimistic updates ?
    // TODO add confirmation modal
    setShouldAnimate(true);
    setAnimationType("remove");
    // emit(messageIdToDelete);
    socket.emit("msg:delete", messageIdToDelete);
  };

  const pushNewMessagesToConvo = (convoId: string, messages: TMessage[]) => {
    setShouldAnimate(true);
    setAnimationType("initial");
    setConvos((currentConvos) => {
      if (!currentConvos) return null;
      const updatedConvos = { ...currentConvos };
      if (updatedConvos[convoId]) {
        updatedConvos[convoId].messages = [
          ...(updatedConvos[convoId].messages || []),
          ...messages,
        ];
      } else {
        updatedConvos[convoId] = { messages };
      }
      return updatedConvos;
    });
  };

  const pushNewMessageToConvo = (convoId: string, message: TMessage) => {
    pushNewMessagesToConvo(convoId, [message]);
  };

  const addNewConvo = (newConvo: any) => {
    setConvos((currConvos) => {
      if (!currConvos) return null;
      return { ...currConvos, ...newConvo };
    });
  };

  const removeConvo = (id: string) => {
    setConvos((currConvos) => {
      if (!currConvos) return null;
      const newConvos = { ...currConvos };
      delete newConvos[id];
      return newConvos;
    });
  };

  function unshiftMessagesToConvo({
    id,
    newMessages,
  }: {
    id: string;
    newMessages: TMessage[];
  }) {
    // console.log("id, newMessages ", id, newMessages);
    setConvos((currentConvos) => {
      // console.log("currentConvos ", currentConvos);
      if (!currentConvos) return {};
      const updatedConvos = { ...currentConvos };
      if (updatedConvos[id]) {
        updatedConvos[id] = {
          ...updatedConvos[id],
          messages: [...newMessages, ...updatedConvos[id].messages],
        };
      } else {
        updatedConvos[id] = {
          messages: [...newMessages],
        };
      }

      return updatedConvos;
    });
  }

  useEffect(() => {
    console.log("convos changed ", convos);
  }, [convos]);

  const getParticipantOnlineStatus = (convoId: string, userId: string) => {
    return onlineStatuses[convoId]?.includes(userId) || false;
  };

  return (
    <AllConvoContext.Provider
      value={{
        convoContext: {
          convos,
          unshiftMessagesToConvo,
          pushNewMessageToConvo,
          pushNewMessagesToConvo,
          handleRemoveMessage,
          initConvo,
          onlineStatuses,
          addNewConvo,
          animationType,
          setAnimationType,
          joinRoom,
          shouldAnimate,
          setShouldAnimate,
        },
        removeConvo,
        activeConvoId: [activeConvoId, handleActiveConvoId],
        socketPoll: [socketPoll, setSocketPoll],
      }}
    >
      {children}
    </AllConvoContext.Provider>
  );
}
