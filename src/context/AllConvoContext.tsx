import { ReactNode, createContext, useEffect, useState } from "react";
import useConvoSocketPoll from "../hooks/useConvoSocketPoll";
import useSockets from "../hooks/useSockets";
import { TConvoContext, TConvos, TMessage, TOnlineStatuses } from "../types";
import useRoomUsersStatus from "@/hooks/useRoomUsersStatus";

// TODO: ask Artem if this could be managed in a less ugly way
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
    // initConvo: () => {},
  },
});

export default function ActiveConvoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [convos, setConvos] = useState<TConvos | null>(null);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [socketPoll, setSocketPoll] = useState<string[] | null>(null);
  const { joinRoom } = useConvoSocketPoll();
  const onlineStatuses = useRoomUsersStatus();

  function getParticipantOnlineStatus(userId: string) {
    if (!activeConvoId) return;
    return onlineStatuses[activeConvoId].participants.filter(
      (participant) => participant.id == userId
    );
  }

  const {
    socketLoading,
    data: deleteMessageIdResponse,
    emit,
  } = useSockets({
    emitFlag: "msg:delete",
    onFlag: "msg:delete:return",
    initialState: "",
  });

  async function initConvo(data: TConvos) {
    setConvos(data);
    const convoIdArray = Object.keys(data);
    convoIdArray.map((id) => joinRoom(id));
  }

  function handleActiveConvoId(id: string | null) {
    if (activeConvoId == id) return;
    setActiveConvoId(id);
  }

  useEffect(() => {
    if (deleteMessageIdResponse) {
      const { id: idToRemove, convoId } = deleteMessageIdResponse as {
        id: string;
        convoId: string;
      };

      if (!convos || !convoId || !idToRemove) return;
      // convos[convoId][id];
      setConvos((currentConvos) => {
        const updatedConvos = { ...currentConvos };
        const convo = updatedConvos[convoId];
        if (!convo || !convo.messages) return currentConvos;
        const filteredMessages = convo.messages.filter(
          ({ id }) => id != idToRemove
        );
        updatedConvos[convoId].messages = filteredMessages;
        return updatedConvos;
      });
    }
  }, [deleteMessageIdResponse]);

  function handleRemoveMessage(convoId: string, messageIdToDelete: string) {
    // TODO: if there's no connection we should wait
    // and excecute deletion after the connection is established
    // also there should be a spinner or a message or something that indicates,
    // that the message will be indeed deleted

    setConvos((currentConvos) => {
      const updatedConvos = { ...currentConvos };
      if (
        updatedConvos[convoId] &&
        Array.isArray(updatedConvos[convoId].messages)
      ) {
        updatedConvos[convoId].messages = updatedConvos?.[
          convoId
        ].messages.filter((message) => {
          return message.id != messageIdToDelete;
        });
      }

      return updatedConvos;
    });
    emit(messageIdToDelete);
  }

  function pushNewMessagesToConvo(convoId: string, messages: TMessage[]) {
    setConvos((currentConvos) => {
      if (!currentConvos) return {};
      const updatedConvos = { ...currentConvos };
      if (updatedConvos[convoId]) {
        updatedConvos[convoId] = {
          ...updatedConvos[convoId],
          messages: [...updatedConvos[convoId].messages, ...messages],
        };
      } else {
        updatedConvos[convoId] = {
          ...updatedConvos[convoId],
          messages: [...messages],
        };
      }

      return updatedConvos;
    });
  }

  function pushNewMessageToConvo(convoId: string, message: TMessage) {
    setConvos((currentConvos) => {
      if (!currentConvos) return {};
      const updatedConvos = { ...currentConvos };
      if (updatedConvos[convoId]) {
        updatedConvos[convoId].messages = [
          ...updatedConvos[convoId].messages,
          message,
        ];
      } else {
        updatedConvos[convoId].messages = [message];
      }

      return updatedConvos;
    });
  }

  function addNewConvo(newConvo: any) {
    const newConvos = {};
    newConvos[newConvo.id] = {
      messages: newConvo.messages,
      participants: newConvo.participants,
    };
    setConvos((currConvos) => {
      if (!currConvos) {
        return newConvos;
      } else {
        return { ...currConvos, newConvos };
      }
    });
  }

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
        },
        activeConvoId: [activeConvoId, handleActiveConvoId],
        socketPoll: [socketPoll, setSocketPoll],
      }}
    >
      {children}
    </AllConvoContext.Provider>
  );
}
