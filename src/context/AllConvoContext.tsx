import { ReactNode, createContext, useEffect, useState } from "react";
import { TConvoContext, TConvos, TMessage, Tactors } from "../types";
import { generateFetchAvatar } from "../utils/fetchAvatar";

export const AllConvoContext = createContext<TConvoContext>({
  activeConvoId: [null, () => {}],
  socketPoll: [null, () => {}],
  convoContext: {
    convos: null,
    unshiftMessagesToConvo: () => {},
    pushNewMessageToConvo: () => {},
    pushNewMessagesToConvo: () => {},
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

  function initConvo({
    id,
    newMessages,
    actors,
  }: {
    id: string;
    newMessages: TMessage[];
    actors: Tactors;
  }) {
    unshiftMessagesToConvo({
      id,
      newMessages,
    });
    initActors(actors, id);
  }

  const fetchAvatar = generateFetchAvatar();

  async function initActors(actors: Tactors, id: string) {
    let initiatorAvatarUrl = null;
    if (actors.initiator.avatarUrl) {
      initiatorAvatarUrl = await fetchAvatar(actors.initiator.avatarUrl);
    }

    let joinerAvatarUrl = null;
    if (actors.joiner.avatarUrl) {
      joinerAvatarUrl = await fetchAvatar(actors.joiner.avatarUrl);
    }

    setConvos((currentConvos) => {
      const newConvos = { ...currentConvos };
      newConvos![id].actors = actors;
      newConvos![id].actors.initiator.avatarUrl = initiatorAvatarUrl;
      newConvos![id].actors.joiner.avatarUrl = joinerAvatarUrl;
      return newConvos;
    });
  }

  function handleActiveConvoId(id: string) {
    if (activeConvoId == id) return;
    setActiveConvoId(id);
  }

  function pushNewMessagesToConvo(convoId: string, messages: TMessage[]) {
    setConvos((currentConvos) => {
      if (!currentConvos) return {};
      const updatedConvos = { ...currentConvos };
      if (updatedConvos[convoId]) {
        updatedConvos[convoId] = {
          ...updatedConvos[convoId],
          messages: { ...updatedConvos[convoId].messages, ...messages },
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

  function unshiftMessagesToConvo({
    id,
    newMessages,
  }: {
    id: string;
    newMessages: TMessage[];
  }) {
    if (!newMessages) return;

    setConvos((currentConvos) => {
      if (currentConvos && currentConvos[id]) {
        const oldMessages = [...currentConvos[id].messages];
        newMessages = [...newMessages, ...oldMessages];
      }
      return {
        ...currentConvos,
        [id]: { ...currentConvos![id], messages: [...newMessages] },
      };
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
