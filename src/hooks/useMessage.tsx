import { useContext, useEffect, useState } from "react";
import { TMessage } from "../types";
import { AuthContext } from "../context/AuthProvider";
import { AllConvoContext } from "../context/AllConvoContext";
import useSockets from "./useSockets";

export default function useMessage() {
  const initialMesssage = {
    content: "",
    convoId: "",
    createdAt: "",
    sender: {
      username: "",
    },
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
    if (!incomingMessage) return;
    // const [convoId, message] = Object.entries(incomingMessage);
    // console.log("convoId: ", convoId);
    // console.log("message: ", incomingMessage);
    pushNewMessageToConvo(incomingMessage.convoId, incomingMessage.message);
  }, [incomingMessage]);

  function sendMessage() {
    emit({ ...message, createdAt: new Date().toISOString() });
    setMessage(initialMesssage);
  }

  function handleMessage(content: string) {
    setMessage((currMessage) => {
      return { ...currMessage, content };
    });
  }

  return { message, sendMessage, handleMessage };
}
