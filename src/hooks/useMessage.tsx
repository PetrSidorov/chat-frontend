import { useCallback, useContext, useState } from "react";
import { useSyncExternalStore } from "react";
import { socket } from "../utils/socket";
import { AuthContext } from "../context/AuthProvider";
import { AllConvoContext } from "../context/AllConvoProvider";

export default function useMessage() {
  const { user } = useContext(AuthContext);
  const [activeConvoId] = useContext(AllConvoContext).activeConvoId;
  const { pushNewMessageToConvo } = useContext(AllConvoContext).convoContext;
  const [message, setMessage] = useState("");
  // TODO: optimistic updates!
  const send = useCallback(() => {
    if (!message.trim() || !user || !activeConvoId) {
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
