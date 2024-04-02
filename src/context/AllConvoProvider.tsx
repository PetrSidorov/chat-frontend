import { ReactNode, createContext, useState, useEffect } from "react";
import useConvoSocketPoll from "../hooks/useConvoSocketPoll";
import useSockets from "../hooks/useSockets";
import useRoomUsersStatus from "@/hooks/useRoomUsersStatus";
import { socket } from "../utils/socket";
import { TConvoContext, TConvos, TMessage } from "../types";

export const AllConvoContext = createContext<TConvoContext>({
  activeConvoId: ["", () => {}],
  socketPoll: [null, () => {}],
  convoContext: {
    convos: {},
    unshiftMessagesToConvo: () => {},
    pushNewMessageToConvo: () => {},
    pushNewMessagesToConvo: () => {},
    handleRemoveMessage: () => {},
    initConvo: () => {},
    getParticipantOnlineStatus: () => false,
    addNewConvo: () => {},
    onlineStatuses: null,
  },
});

export default function ActiveConvoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [convos, setConvos] = useState<TConvos | null>(null);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const onlineStatuses = useRoomUsersStatus();
  const { joinRoom } = useConvoSocketPoll();
  const { emit } = useSockets({
    emitFlag: "msg:delete",
    onFlag: "msg:delete:return",
    initialState: "",
  });
  const [socketPoll, setSocketPoll] = useState<string[] | null>(null);

  useEffect(() => {
    const handleMessageReturn = (incomingMessage: TMessage) => {
      if (incomingMessage && incomingMessage.convoId === activeConvoId) {
        setConvos((currentConvos) => {
          // TODO: write something meaningful here
          // This should never happen
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

    return () => {
      socket.off("msg:return", handleMessageReturn);
    };
  }, [activeConvoId]);

  const initConvo = (data: TConvos) => {
    setConvos(data);
    Object.keys(data).forEach(joinRoom);
  };

  const handleActiveConvoId = (id: string | null) => {
    if (activeConvoId === id) return;
    setActiveConvoId(id);
  };

  const handleRemoveMessage = (messageIdToDelete: string) => {
    emit({ eventId: messageIdToDelete });
  };

  const pushNewMessagesToConvo = (convoId: string, messages: TMessage[]) => {
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
          ...updatedConvos[id],
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
