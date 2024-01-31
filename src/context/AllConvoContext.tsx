import { ReactNode, createContext, useEffect, useState } from "react";
import { TConvoContext, TConvos, TMessage } from "../types";

export const AllConvoContext = createContext<TConvoContext>({
  convoContext: [null, () => {}],
  activeConvoId: [null, () => {}],
});

export default function ActiveConvoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [convos, setConvos] = useState<TConvos | null>(null);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);

  function handleActiveConvoId(id: string) {
    if (activeConvoId == id) return;
    setActiveConvoId(id);
  }

  function addMessagesToConvo({
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
        convoContext: [convos, addMessagesToConvo],
        activeConvoId: [activeConvoId, handleActiveConvoId],
      }}
    >
      {children}
    </AllConvoContext.Provider>
  );
}
