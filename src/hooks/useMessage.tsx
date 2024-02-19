import { useContext, useEffect, useState } from "react";
import { TMessage } from "../types";
import { AuthContext } from "../context/AuthProvider";
import { AllConvoContext } from "../context/AllConvoContext";
import useSockets from "./useSockets";
import isEmpty from "../utils/isEmpty";
// id         String   @id @default(cuid())
// content    String
// createdAt  DateTime @default(now())
// senderId   String
// receiverId String
// convoId    String

export default function useMessage() {
  const [user, _] = useContext(AuthContext);
  const [message, setMessage] = useState<string>("");
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
    setMessage("");
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
    if (!user || isEmpty(user) || !activeConvoId || !convos) return;

    emit({
      content: message,
      convoId: activeConvoId,
      receiverId: convos[activeConvoId].receiver.id,
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      senderId: user.id,
      // TODO: use this Uuid for optimistic updates
      // id: crypto.randomUUID(),
    });

    setMessage("");
  }

  function handleMessage(content: string) {
    setMessage(content);
  }

  return { message, sendMessage, handleMessage };
}
