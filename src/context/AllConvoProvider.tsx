import useRoomUsersStatus from "@/hooks/useRoomUsersStatus";
import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { TConvoContext, TConvos, TMessage } from "../types";
import { socket } from "../utils/socket";

export const AllConvoContext = createContext<TConvoContext>(null);

type AnimationType =
  | "avatar"
  | "enter"
  | "editMessage"
  | "remove"
  | "convoSwitch";

type StateType = {
  convos: Tconvos | null;
  newMessage: boolean;
  animation: AnimationType;
  activeConvoId: string;
  shouldAnimate: boolean;
};
type ActionType =
  | { type: "initConvos"; data: Tconvos }
  | {
      type: "editMessage";
      data: {
        messageEdited: TMessage;
        convoId: string;
      };
    }
  | {
      type: "newMessage";
      data: {
        message: TMessage;
        convoId: string;
        animation: AnimationType;
        newMessage: boolean;
      };
    }
  | {
      type: "activeConvoSwitch";
      data: {
        convoId: string;
      };
    }
  | {
      type: "handleMessageDelete";
      data: {
        convoId: string;
        uuid: string;
      };
    }
  | {
      type: "handleRemoveMessage";
      data: {
        shouldAnimate: boolean;
        animation: AnimationType;
      };
    };

function reducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "initConvos": {
      return {
        ...state,
        convos: action.data,
      };
    }
    case "editMessage": {
      const { convoId, messageEdited } = action.data;
      if (!state.convos[convoId]) break;
      const updatedConvos = { ...state.convos };
      return {
        ...state,
        convos: {
          ...updatedConvos[convoId],
          messages: [
            ...updatedConvos[convoId].messages.map((message: TMessage) => {
              if (message.uuid == messageEdited.uuid) {
                return messageEdited;
              } else {
                return message;
              }
            }),
          ],
        },
      };
    }
    case "newMessage": {
      if (!state.convos) break;
      const { message, convoId, animation, newMessage } = action.data;

      const updatedConvos = { ...state.convos };
      updatedConvos[convoId].messages = [
        ...(updatedConvos[convoId].messages || []),
        message,
      ];
      return {
        ...state,
        animation,
        newMessage,
        convos: updatedConvos,
      };
    }
    case "activeConvoSwitch": {
      return { ...state, activeConvoId: action.data.convoId };
    }
    case "handleMessageDelete": {
      const { convoId, uuid: messageToDelete } = action.data;
      const updatedConvos = { ...state.convos };
      if (!updatedConvos?.[convoId]) break;
      const updatedMessages = updatedConvos[convoId].messages.filter(
        ({ uuid }: { uuid: string }) => uuid !== messageToDelete
      );
      updatedConvos[convoId].messages = updatedMessages;
      return {
        ...state,
        convos: updatedConvos,
      };
    }

    case "handleRemoveMessage": {
      return { ...state };
    }
  }
}

export default function ActiveConvoProvider({
  children,
}: {
  children: ReactNode;
}) {
  // TODO: maybe at least half of this stuff should be a reducer
  const [state, dispatch] = useReducer(reducer, {
    convos: null,
    newMessage: false,
    animation: "enter",
    activeConvoId: "",
    shouldAnimate: true,
  });
  const [isConnected, setIsConnected] = useState(socket.connected);

  const [newMessage, setNewMessage] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(true);
  const [animationType, setAnimationType] = useState("enter");

  const [convos, setConvos] = useState<TConvos | null>(null);
  const [activeConvoId, setActiveConvoId] = useState<string>("");
  const onlineStatuses = useRoomUsersStatus();

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("socket connected!!!!");
    });

    socket.on("msg:edit-return", ({ message: messageEdited, convoId }) => {
      handlemesageEdit({ messageEdited, convoId });
    });

    socket.on("disconnect", () => setIsConnected(false));
    socket.on("connect_error", (error) => {
      console.log("Connection Error:", error);
      setIsConnected(false);
    });

    setIsConnected(socket.connected);

    return () => {
      socket.off("connect");
      socket.off("disconnect");
      socket.off("connect_error");
      socket.off("room:onlineUsers");
    };
  }, []);

  useEffect(() => {
    socket.on("msg:return", handleNewMessage);
    socket.on("msg:delete:return", handleMessageDelete);

    return () => {
      socket.off("msg:return", handleNewMessage);
      socket.off("msg:delete:return", handleMessageDelete);
    };
  }, [activeConvoId]);

  // ↓ reducer used
  const handlemesageEdit = ({
    messageEdited,
    convoId,
  }: {
    messageEdited: TMessage;
    convoId: string;
  }) => {
    dispatch({
      type: "editMessage",
      data: {
        messageEdited,
        convoId,
      },
    });
  };

  // ↓ reducer used
  const initConvo = (data: TConvos) => {
    Object.keys(data).forEach((convoId) => socket.emit("room:join", convoId));
    dispatch({ type: "initConvos", data });
  };

  // ↓ reducer used
  const handleNewMessage = ({
    message,
    convoId,
  }: {
    message: TMessage;
    convoId: string;
  }) => {
    dispatch({
      type: "newMessage",
      data: {
        animation: "enter",
        newMessage: true,
        convoId,
        message,
      },
    });
  };

  // ↓ reducer used
  const handleActiveConvoId = (id: string) => {
    if (state.activeConvoId === id) return;

    dispatch({
      type: "activeConvoSwitch",
      data: {
        convoId: id,
      },
    });
  };

  // ↓ reducer used
  function handleMessageDelete({
    uuid,
    convoId,
  }: {
    uuid: string;
    convoId: string;
  }) {
    dispatch({
      type: "handleMessageDelete",
      data: {
        uuid,
        convoId,
      },
    });
  }

  // ↓ reducer  used
  const handleRemoveMessage = (messageIdToDelete: string) => {
    // TODO: optimistic updates ?
    // TODO add confirmation modal
    dispatch({
      type: "handleRemoveMessage",
      data: {
        shouldAnimate: true,
        animation: "remove",
      },
    });

    socket.emit("msg:delete", messageIdToDelete);
  };

  const pushNewMessagesToConvo = (convoId: string, messages: TMessage[]) => {
    // TODO: do i even use this ?
    setShouldAnimate(true);
    setAnimationType("initial");
    setConvos((currentConvos) => {
      if (!currentConvos) return null;
      const updatedConvos = { ...currentConvos };
      if (updatedConvos[convoId]) {
        updatedConvos[convoId].messages = [
          ...(updatedConvos[convoId].messages || []),
          ...messages,
        ];
      } else {
        updatedConvos[convoId] = { messages };
      }
      return updatedConvos;
    });
  };

  const pushNewMessageToConvo = (convoId: string, message: TMessage) => {
    pushNewMessagesToConvo(convoId, [message]);
  };

  const addNewConvo = (newConvo: any) => {
    setConvos((currConvos) => {
      if (!currConvos) return null;
      return { ...currConvos, ...newConvo };
    });
  };

  const removeConvo = (id: string) => {
    setConvos((currConvos) => {
      if (!currConvos) return null;
      const newConvos = { ...currConvos };
      delete newConvos[id];
      return newConvos;
    });
  };

  function unshiftMessagesToConvo({
    id,
    newMessages,
  }: {
    id: string;
    newMessages: TMessage[];
  }) {
    // console.log("id, newMessages ", id, newMessages);
    setConvos((currentConvos) => {
      // console.log("currentConvos ", currentConvos);
      if (!currentConvos) return {};
      const updatedConvos = { ...currentConvos };
      if (updatedConvos[id]) {
        updatedConvos[id] = {
          ...updatedConvos[id],
          messages: [...newMessages, ...updatedConvos[id].messages],
        };
      } else {
        updatedConvos[id] = {
          messages: [...newMessages],
        };
      }

      return updatedConvos;
    });
  }

  useEffect(() => {
    console.log("convos changed ", convos);
  }, [convos]);

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
          animationType,
          setAnimationType,
          joinRoom,
          shouldAnimate,
          setShouldAnimate,
          newMessage,
          setNewMessage,

          // editMessageMode,
          // messageEdited,
        },
        removeConvo,
        activeConvoId: [activeConvoId, handleActiveConvoId],
      }}
    >
      {children}
    </AllConvoContext.Provider>
  );
}
