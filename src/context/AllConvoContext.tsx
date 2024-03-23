import {
  ReactNode,
  createContext,
  useState,
  useSyncExternalStore,
} from "react";
import useConvoSocketPoll from "../hooks/useConvoSocketPoll";
import useSockets from "../hooks/useSockets";
import { TConvoContext, TConvos, TMessage } from "../types";
import useRoomUsersStatus from "@/hooks/useRoomUsersStatus";
import { socket } from "../utils/socket";

export const AllConvoContext = createContext<TConvoContext>({
  activeConvoId: ["", () => {}],
  socketPoll: [null, () => {}],
  convoContext: {
    convos: {},
    unshiftMessagesToConvo: () => {},
    pushNewMessageToConvo: () => {},
    pushNewMessagesToConvo: () => {},
    handleRemoveMessage: () => {},
    initConvo: () => {},
    getParticipantOnlineStatus: () => false,
  },
});

export default function ActiveConvoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [convos, setConvos] = useState<TConvos | null>(null);
  const [activeConvoId, setActiveConvoId] = useState<string | null>(null);
  const onlineStatuses = useRoomUsersStatus();
  const { joinRoom } = useConvoSocketPoll();
  const { emit } = useSockets({
    emitFlag: "msg:delete",
    onFlag: "msg:delete:return",
    initialState: "",
  });
  const [socketPoll, setSocketPoll] = useState<string[] | null>(null);

  const subscribe = (callback: () => void) => {
    const handleMessageDelete = ({
      id: idToRemove,
      convoId,
    }: {
      id: string;
      convoId: string;
    }) => {
      if (!convos || !convoId || !idToRemove) return;
      setConvos((currentConvos) => {
        const updatedConvos = { ...currentConvos };
        const convo = updatedConvos[convoId];
        if (!convo || !convo.messages) return currentConvos;
        const filteredMessages = convo.messages.filter(
          ({ id }) => id !== idToRemove
        );
        updatedConvos[convoId].messages = filteredMessages;
        return updatedConvos;
      });
      callback();
    };

    socket.on("msg:delete:return", handleMessageDelete);
    return () => socket.off("msg:delete:return", handleMessageDelete);
  };

  const getSnapshot = () => null; // Left as null, adjust if needed for synchronous access to state.
  useSyncExternalStore(subscribe, getSnapshot);

  const initConvo = (data: TConvos) => {
    setConvos(data);
    Object.keys(data).forEach(joinRoom);
  };

  const handleActiveConvoId = (id: string | null) => {
    if (activeConvoId === id) return;
    setActiveConvoId(id);
  };

  const handleRemoveMessage = (messageIdToDelete: string) => {
    emit({ eventId: messageIdToDelete });
  };

  const pushNewMessagesToConvo = (convoId: string, messages: TMessage[]) => {
    setConvos((currentConvos) => {
      const updatedConvos = { ...currentConvos };
      if (updatedConvos[convoId]) {
        updatedConvos[convoId].messages = [
          ...updatedConvos[convoId].messages,
          ...messages,
        ];
      } else {
        updatedConvos[convoId] = { messages: messages };
      }
      return updatedConvos;
    });
  };

  const pushNewMessageToConvo = (convoId: string, message: TMessage) => {
    pushNewMessagesToConvo(convoId, [message]);
  };

  const subscribeT = (callback: () => void) => {
    socket.on("msg:return", (incomingMessage) => {
      if (incomingMessage && incomingMessage.convoId === activeConvoId) {
        pushNewMessageToConvo(incomingMessage.convoId, incomingMessage);
        callback();
      }
    });

    return () => {
      socket.off("msg:return");
    };
  };

  const getSnapshotT = () => null;

  useSyncExternalStore(subscribeT, getSnapshotT);

  function addNewConvo(newConvo: any) {
    // console.log("newConvo ", {}...newConvo]);

    setConvos((currConvos) => {
      console.log("currConvos ", currConvos);
      if (!currConvos) {
        console.log("test 222 ", { ...newConvo });
        return { ...newConvo };
      } else {
        console.log("test 111 ", { ...currConvos, ...newConvo });
        return { ...currConvos, ...newConvo };
      }
    });
  }

  const unshiftMessagesToConvo = (convoId: string, newMessages: TMessage[]) => {
    setConvos((currentConvos) => {
      const updatedConvos = { ...currentConvos };
      if (updatedConvos[convoId]) {
        updatedConvos[convoId].messages = [
          ...newMessages,
          ...updatedConvos[convoId].messages,
        ];
      } else {
        updatedConvos[convoId] = { messages: newMessages };
      }
      return updatedConvos;
    });
  };

  const getParticipantOnlineStatus = (convoId: string, userId: string) => {
    return onlineStatuses[convoId]?.includes(userId) || false;
  };

  return (
    <AllConvoContext.Provider
      value={{
        convoContext: {
          convos,
          unshiftMessagesToConvo,
          pushNewMessageToConvo,
          pushNewMessagesToConvo,
          handleRemoveMessage,
          initConvo,
          onlineStatuses,
          addNewConvo,
        },
        activeConvoId: [activeConvoId, handleActiveConvoId],
        socketPoll: [socketPoll, setSocketPoll],
      }}
    >
      {children}
    </AllConvoContext.Provider>
  );
}
