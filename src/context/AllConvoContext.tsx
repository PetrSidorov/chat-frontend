import { ReactNode, createContext, useState } from "react";
import { TConvoContext, TConvos, TMessage } from "../types";
import useConvoSocketPoll from "../hooks/useConvoSocketPoll";

export const AllConvoContext = createContext<TConvoContext>({
  activeConvoId: [null, () => {}],
  socketPoll: [null, () => {}],
  convoContext: {
    convos: null,
    unshiftMessagesToConvo: () => {},
    pushNewMessageToConvo: () => {},
    pushNewMessagesToConvo: () => {},
    handleOnlineStatuses: () => {},
    handleRemoveMessage: () => {},
    initConvo: () => {},
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
  const [_, addConvoToSocketPoll] = useConvoSocketPoll();

  async function initConvo(data: TConvos) {
    setConvos(data);
    const convoIdArray = Object.keys(data);
    convoIdArray.map((id) => addConvoToSocketPoll(id));
  }

  function handleActiveConvoId(id: string | null) {
    if (activeConvoId == id) return;
    setActiveConvoId(id);
  }

  function handleRemoveMessage(convoId: string, messageIdToDelete: string) {
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
    // if (!convoId || !message) return;
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

  function handleOnlineStatuses(convoId: string, online: boolean) {
    setConvos((currConvos) => {
      const updatedConvos = { ...currConvos };
      updatedConvos[convoId] = { ...updatedConvos[convoId], online };
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
          handleOnlineStatuses,
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
