import { useContext, useEffect, useState } from "react";
import { TMessage } from "../types";
import { AuthContext } from "../context/AuthProvider";
import { AllConvoContext } from "../context/AllConvoContext";
import useSockets from "./useSockets";
// id         String   @id @default(cuid())
// content    String
// createdAt  DateTime @default(now())
// senderId   String
// receiverId String
// convoId    String

function createConvoId(senderId: string, receiverId: string) {
  return; // something that combines senderId and recenverId ..
}

export default function useMessage() {
  const initialMesssage = {
    id: "",
    content: "",
    convoId: "",
    createdAt: "",
    senderId: "",
    receiverId: "",
  };
  const [user, _] = useContext(AuthContext);
  const [message, setMessage] = useState<TMessage>(initialMesssage);
  const [activeConvoId, handleActiveConvoId] =
    useContext(AllConvoContext).activeConvoId;
  const { convos, pushNewMessageToConvo } =
    useContext(AllConvoContext).convoContext;
  const {
    socketLoading,
    data: incomingMessage,
    emit,
  } = useSockets({
    emitFlag: "msg:create",
    onFlag: "msg:return",
    initialState: {},
  });

  useEffect(() => {
    if (!user || !user.username || !activeConvoId) return;
    setMessage((currMessage) => {
      return {
        ...currMessage,
        sender: {
          username: user?.username,
        },
        convoId: activeConvoId,
      };
    });
  }, [user, activeConvoId]);

  useEffect(() => {
    if (!incomingMessage || !incomingMessage.id) return;

    if (incomingMessage != activeConvoId) {
      // TODO:add unread here
    }
    const { convoId, ...message } = incomingMessage;
    pushNewMessageToConvo(convoId, message);
  }, [incomingMessage]);

  function sendMessage(e: KeyboardEvent) {
    e.preventDefault();
    const senderId = user?.id;
    const receiverId =
      user?.id == convos[activeConvoId].actors.initiator.id
        ? convos[activeConvoId].actors.initiator.id
        : convos[activeConvoId].actors.joiner.id;

    emit({
      ...message,
      createdAt: new Date().toISOString(),
      receiverId,
      senderId,
      // TODO: use this Uuid for optimistic updates
      id: crypto.randomUUID(),
    });
    setMessage(initialMesssage);
  }

  function handleMessage(content: string) {
    setMessage((currMessage) => {
      return { ...currMessage, content };
    });
  }

  return { message, sendMessage, handleMessage };
}
