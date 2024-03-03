import { useCallback, useContext, useEffect, useState } from "react";
import { TMessage } from "../types";
import { AuthContext } from "../context/AuthProvider";
import { AllConvoContext } from "../context/AllConvoContext";
import useSockets from "./useSockets";
import isEmpty from "../utils/isEmpty";

export default function useMessage() {
  const { user } = useContext(AuthContext);
  const [message, setMessage] = useState("");
  const [activeConvoId] = useContext(AllConvoContext).activeConvoId;
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
    if (!incomingMessage || !incomingMessage.id) return;

    if (incomingMessage != activeConvoId) {
      // TODO:add unread here
    }
    const { convoId, ...message } = incomingMessage;
    pushNewMessageToConvo(convoId, message);
  }, [incomingMessage]);

  const send = useCallback(() => {
    if (!message.trim()) {
      console.log("Message is empty or only whitespace");
      return;
    }
    if (!user || isEmpty(user) || !activeConvoId || !convos) {
      console.log("User, active conversation, or convos are not properly set");
      return;
    }

    emit({
      content: message,
      convoId: activeConvoId,
      receiverId: convos[activeConvoId].receiver.id,
      createdAt: new Date().toISOString(),
      id: crypto.randomUUID(),
      senderId: user.id,
      // TODO: use this Uuid for optimistic updates
    });

    setMessage("");
  }, [message, user, activeConvoId, convos, emit]);

  return { message, setMessage, send };
}
