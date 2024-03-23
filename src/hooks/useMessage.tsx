import { useCallback, useContext, useState } from "react";
import { useSyncExternalStore } from "react";
import { socket } from "../utils/socket";
import { AuthContext } from "../context/AuthProvider";
import { AllConvoContext } from "../context/AllConvoContext";

export default function useMessage() {
  const { user } = useContext(AuthContext);
  const [activeConvoId] = useContext(AllConvoContext).activeConvoId;
  const { pushNewMessageToConvo } = useContext(AllConvoContext).convoContext;
  const [message, setMessage] = useState("");

  // const subscribe = (callback: () => void) => {
  //   socket.on("msg:return", (incomingMessage) => {
  //     if (incomingMessage && incomingMessage.convoId === activeConvoId) {
  //       pushNewMessageToConvo(incomingMessage.convoId, incomingMessage);
  //       callback();
  //     }
  //   });

  //   return () => {
  //     socket.off("msg:return");
  //   };
  // };

  // const getSnapshot = () => null;

  // useSyncExternalStore(subscribe, getSnapshot);

  const send = useCallback(() => {
    if (!message.trim() || !user || !activeConvoId) {
      console.error("Message is empty, or user/activeConvoId is not set.");
      return;
    }

    socket.emit("msg:create", {
      content: message,
      convoId: activeConvoId,
      createdAt: new Date().toISOString(),
      senderId: user.id,
    });

    setMessage("");
  }, [message, user, activeConvoId]);

  return { message, setMessage, send };
}
