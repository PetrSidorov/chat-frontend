import { useCallback, useContext, useEffect, useState } from "react";
import { AllConvoContext } from "../context/AllConvoProvider";
import { AuthContext } from "../context/DeprecatedAuthProvider";
import { socket } from "../utils/socket";
import useGetUser from "./react-query/useGetUser";
import { useActiveConvoIdStore } from "@/store";

export default function useMessage() {
  // const { user } = useContext(AuthContext);
  const { user } = useGetUser();
  // const [activeConvoId] = useContext(AllConvoContext).activeConvoId;
  const activeConvoId = useActiveConvoIdStore((state) => state.activeConvoId);
  const { pushNewMessageToConvo } = useContext(AllConvoContext).convoContext;
  const [createdMessage, setCreatedMessage] = useState("");
  const [editMessageMode, setEditMessageMode] = useState(false);
  const [messageEdited, setMessageEdited] = useState({
    messageId: "",
    content: "",
  });

  // TODO: optimistic updates!
  // useEffect(() => {
  //   console.log("messageEdited ", messageEdited);
  //   console.log("editMessageMode ", editMessageMode);
  // }, [messageEdited, editMessageMode]);

  const send = useCallback(() => {
    if (!createdMessage.trim() || !user || !activeConvoId) {
      return;
    }

    socket.emit("msg:create", {
      content: createdMessage,
      convoId: activeConvoId,
      createdAt: new Date().toISOString(),
      senderId: user.id,
    });

    setCreatedMessage("");
  }, [createdMessage, user, activeConvoId]);

  const edit = useCallback(() => {
    if (
      !messageEdited?.content.trim() ||
      !messageEdited?.messageId ||
      !user ||
      !activeConvoId
    ) {
      return;
    }
    socket.emit("msg:edit", {
      messageId: messageEdited.messageId,
      content: messageEdited.content,
    });
  }, [messageEdited, user, activeConvoId]);

  return {
    createdMessage,
    setCreatedMessage,
    send,
    edit,
    messageEdited,
    editMessageMode,
    setMessageEdited,
    setEditMessageMode,
  };
}
