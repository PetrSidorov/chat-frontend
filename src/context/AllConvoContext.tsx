import { ReactNode, createContext, useEffect, useMemo, useState } from "react";
import { TConvoContext, TConvos, TMessage } from "../types";

export const AllConvoContext = createContext<TConvoContext>({
  convoContext: [null, () => {}],
  activeConvoId: [null, () => {}],
  socketPoll: [null, () => {}],
});

export default function ActiveConvoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [convos, setConvos] = useState<TConvos | null>(null);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const [socketPoll, setSocketPoll] = useState<string[] | null>(null);

  function handleActiveConvoId(id: string) {
    if (activeConvoId == id) return;
    setActiveConvoId(id);
  }

  function pushNewMessagesToConvo(convoId: string, messages: TMessage[]) {
    setConvos((currentConvos) => {
      if (!currentConvos) return;
      let convoWithNewMessage;
      if (currentConvos[convoId]) {
        convoWithNewMessage = [...currentConvos[convoId], ...messages];
      } else {
        convoWithNewMessage = { [convoId]: [...messages] };
      }

      console.log(convoWithNewMessage);
      return { ...convoWithNewMessage };
    });
  }

  function pushNewMessageToConvo(convoId: string, message: TMessage) {
    setConvos((currentConvos) => {
      if (!currentConvos) return;
      let convoWithNewMessage;
      if (currentConvos[convoId]) {
        convoWithNewMessage = {
          ...currentConvos,
          [convoId]: [...currentConvos[convoId], message],
        };
      } else {
        convoWithNewMessage = { [convoId]: [message] };
      }

      return { ...convoWithNewMessage };
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
        const oldMessages = [...currentConvos[id]];
        newMessages = [...newMessages, ...oldMessages];
      }
      return {
        ...currentConvos,
        [id]: [...newMessages],
      };
    });

    // useEffect(() => {
    //   console.log("convos: ", convos);
    // }, []);

    // setConvos((currentConvos) => {
    //   if (currentConvos) {
    //     return currentConvos.map((convo) => {
    //       if (convo.id == id) {
    //         const updatedMessages = [...convo.messages, messages];
    //         convo.messages = updatedMessages;
    //       }
    //     });
    //   } else {
    //     return [...messages];
    //   }
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
        },
        activeConvoId: [activeConvoId, handleActiveConvoId],
        socketPoll: [socketPoll, setSocketPoll],
      }}
    >
      {children}
    </AllConvoContext.Provider>
  );
}
