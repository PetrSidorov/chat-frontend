import { ReactNode, createContext, useState } from "react";
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

  async function initConvo({
    id,
    newMessages,
    actors,
  }: {
    id: string;
    newMessages: TMessage[];
    actors: Tactors;
  }) {
    // initActors(actors, id);
    // unshiftMessagesToConvo({
    //   id,
    //   newMessages,
    // });
    let initiatorAvatarUrl = null;
    if (actors.initiator.avatarUrl) {
      initiatorAvatarUrl = await fetchAvatar(actors.initiator.avatarUrl);
    }

    let joinerAvatarUrl = null;
    if (actors.joiner.avatarUrl) {
      joinerAvatarUrl = await fetchAvatar(actors.joiner.avatarUrl);
    }

    setConvos((currentConvos) => {
      if (!currentConvos) return {};

      const updatedConvos = { ...currentConvos };
      actors.initiator.avatarUrl = initiatorAvatarUrl;
      actors.joiner.avatarUrl = joinerAvatarUrl;
      if (updatedConvos[id]) {
        updatedConvos[id] = {
          ...updatedConvos[id],
          messages: [...newMessages, ...updatedConvos[id].messages],
          actors,
        };
      } else {
        updatedConvos[id] = {
          ...updatedConvos[id],
          messages: [...newMessages],
          actors,
        };
      }

      return updatedConvos;
    });
  }

  const fetchAvatar = generateFetchAvatar();

  // async function initActors(actors: Tactors, id: string) {
  //   // console.log("actors, id ", actors, id);
  //   let initiatorAvatarUrl = null;
  //   if (actors.initiator.avatarUrl) {
  //     initiatorAvatarUrl = await fetchAvatar(actors.initiator.avatarUrl);
  //   }

  //   let joinerAvatarUrl = null;
  //   if (actors.joiner.avatarUrl) {
  //     joinerAvatarUrl = await fetchAvatar(actors.joiner.avatarUrl);
  //   }

  //   setConvos((currentConvos) => {
  //     const newConvos = { ...currentConvos };
  //     newConvos![id].actors = actors;
  //     newConvos![id].actors.initiator.avatarUrl = initiatorAvatarUrl;
  //     newConvos![id].actors.joiner.avatarUrl = joinerAvatarUrl;

  //     return newConvos;
  //   });
  // }

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

  // function pushNewMessageToConvo(message) {
  //   const convoId = message?.convoId;
  //   console.log(message);
  // setConvos((currentConvos) => {
  //   if (!currentConvos) return {};
  //   const updatedConvos = { ...currentConvos };
  //   if (updatedConvos[convoId]) {
  //     updatedConvos[convoId].messages = [
  //       ...updatedConvos[convoId].messages,
  //       message,
  //     ];
  //   } else {
  //     updatedConvos[convoId].messages = [message];
  //   }

  //   return updatedConvos;
  // });
  // }
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
    // if (!newMessages) return;
    // console.log("newMessages ", newMessages);
    // setConvos((currentConvos) => {
    //   if (currentConvos && currentConvos[id]) {
    //     const oldMessages = [...currentConvos[id].messages];
    //     newMessages = [...newMessages, ...oldMessages];
    //   }
    //   return {
    //     ...currentConvos,
    //     [id]: { ...currentConvos![id], messages: [...newMessages] },
    //   };
    // });
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
