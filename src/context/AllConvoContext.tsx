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
  const [activeConvoId, setActiveConvoId] = useState<String | null>(null);

  function addMessagesToConvo({
    id,
    newMessages,
  }: {
    id: string;
    newMessages: TMessage[];
  }) {
    setConvos((currentConvos) => {
      if (currentConvos && currentConvos.id && currentConvos.id) {
        const oldMessages = currentConvos.id;
        newMessages = [...oldMessages, ...newMessages];
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

  // useEffect(() => {
  //   console.log(activeConvoId);

  //   return () => {};
  // }, [activeConvoId]);

  return (
    <AllConvoContext.Provider
      value={{
        convoContext: [convos, addMessagesToConvo],
        activeConvoId: [activeConvoId, setActiveConvoId],
      }}
    >
      {children}
    </AllConvoContext.Provider>
  );
}
