import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from "react";

import useGetUser from "@/hooks/react-query/useGetUser";
import { useActiveConvoIdStore } from "@/store";
import { socket } from "@/utils/socket";

type MessageProviderProps = {
  children: ReactNode;
};

type MessageEditedType = {
  messageId: string;
  content: string;
};

type TMessageContext = {
  // createdMessageContent: string;
  // setCreatedMessageContent: Dispatch<SetStateAction<string>>;
  // send: () => void;
  edit: () => void;
  messageEdited: MessageEditedType;
  editMessageMode: boolean;
  setMessageEdited: Dispatch<SetStateAction<MessageEditedType>>;
  setEditMessageMode: Dispatch<SetStateAction<boolean>>;
};

export const MessageContext = createContext<TMessageContext | null>(null);
export default function MessageProvider({ children }: MessageProviderProps) {
  // const { user } = useContext(AuthContext);
  const { user } = useGetUser();
  // const [activeConvoId] = useContext(AllConvoContext).activeConvoId;
  const activeConvoId = useActiveConvoIdStore((state) => state.activeConvoId);

  // const [createdMessageContent, setCreatedMessageContent] = useState("");
  const [editMessageMode, setEditMessageMode] = useState(false);
  const [messageEdited, setMessageEdited] = useState({
    messageId: "",
    content: "",
  });

  // const send = useCallback(() => {
  //   if (!createdMessageContent.trim() || !user || !activeConvoId) {
  //     return;
  //   }

  //   socket.emit("msg:create", {
  //     content: createdMessageContent,
  //     convoId: activeConvoId,
  //     createdAt: new Date().toISOString(),
  //     senderId: user.id,
  //   });

  //   setCreatedMessageContent("");
  // }, [createdMessageContent, user, activeConvoId]);

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

    setEditMessageMode(false);
  }, [messageEdited, user, activeConvoId]);

  return (
    <MessageContext.Provider
      value={{
        // /createdMessageContent,
        // setCreatedMessageContent,
        // send,
        edit,
        messageEdited,
        editMessageMode,
        setMessageEdited,
        setEditMessageMode,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}
