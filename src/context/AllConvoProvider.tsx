import useRoomUsersStatus from "@/hooks/useRoomUsersStatus";
import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { TConvoContext, TConvos, TConvo, TMessage, Tconvo } from "../types";
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
      type: "handleRemoveMessage";
      data: {
        convoId: string;
        uuid: string;
        shouldAnimate: boolean;
        animation: AnimationType;
      };
    }
  | {
      type: "pushNewMessageToConvo";
      data: {
        convoId: string;
        message: TMessage;
        shouldAnimate: boolean;
        animation: AnimationType;
      };
    }
  | {
      type: "addNewConvo";
      data: {
        newConvo: Tconvo;
      };
    }
  | {
      type: "removeConvo";
      data: {
        convoId: string;
      };
    }
  | {
      type: "unshiftMessagesToConvo";
      data: {
        newMessages: Tmessage[];
        id: string;
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
    case "handleRemoveMessage": {
      const { convoId, uuid: messageToDelete, shouldAnimate } = action.data;
      const updatedConvos = { ...state.convos };
      if (!updatedConvos?.[convoId]) break;
      const updatedMessages = updatedConvos[convoId].messages.filter(
        ({ uuid }: { uuid: string }) => uuid !== messageToDelete
      );

      updatedConvos[convoId].messages = updatedMessages;
      return {
        ...state,
        convos: updatedConvos,
        shouldAnimate,
      };
    }
    case "pushNewMessageToConvo": {
      const updatedConvos = { ...state.convos };
      const { message, convoId } = action.data;
      if (updatedConvos[convoId]) {
        updatedConvos[convoId].messages = [
          ...(updatedConvos[convoId].messages || []),
          message,
        ];
      }

      return {
        ...state,
        shouldAnimate: true,
        animation: "enter",
        convos: updatedConvos,
      };
    }
    case "addNewConvo": {
      const { newConvo } = action.data;
      return {
        ...state,
        convos: { ...state.convos, newConvo },
      };
    }
    case "removeConvo": {
      const newConvos = { ...state.convos };
      const { convoId } = action.data;
      delete newConvos[convoId];
      return { ...state, convos: newConvos };
    }

    case "unshiftMessagesToConvo": {
      const updatedConvos = { ...state.convos };
      const { newMessages, id } = action.data;
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
      return { ...state, convos: updatedConvos };
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
    socket.on("msg:delete:return", handleRemoveMessage);

    return () => {
      socket.off("msg:return", handleNewMessage);
      socket.off("msg:delete:return", handleRemoveMessage);
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
  const handleRemoveMessage = ({
    convoId,
    uuid,
  }: {
    convoId: string;
    uuid: string;
  }) => {
    // TODO: optimistic updates ?
    // TODO add confirmation modal
    dispatch({
      type: "handleRemoveMessage",
      data: {
        shouldAnimate: true,
        animation: "remove",
        convoId,
        uuid,
      },
    });
  };

  // ↓ reducer  used
  const pushNewMessageToConvo = (convoId: string, message: TMessage) => {
    dispatch({
      type: "pushNewMessageToConvo",
      data: {
        convoId,
        message,
        shouldAnimate: true,
        animation: "enter",
      },
    });
  };

  // ↓ reducer used
  const addNewConvo = (newConvo: any) => {
    dispatch({
      type: "addNewConvo",
      data: {
        newConvo,
      },
    });
  };

  // ↓ reducer used
  const removeConvo = (id: string) => {
    dispatch({
      type: "removeConvo",
      data: {
        convoId: id,
      },
    });
  };

  // ↓ reducer used
  function unshiftMessagesToConvo({
    id,
    newMessages,
  }: {
    id: string;
    newMessages: TMessage[];
  }) {
    dispatch({
      type: "unshiftMessagesToConvo",
      data: {
        newMessages,
        id,
      },
    });
  }

  // async function joinRoom(convoId: string) {
  //   console.log("Attempting to join room", convoId);
  //   console.log("socketPoll is ", socketPoll);
  //   // if (!convoId || socketPoll?.includes(convoId)) return;

  //   try {
  //     //await waitForSocketConnection();

  //     socket.emit("room:join", convoId);
  //     setSocketPoll((currSocketPoll) => [
  //       ...new Set([...(currSocketPoll || []), convoId]),
  //     ]);
  //   } catch (error) {
  //     console.log("Failed to connect to socket:", error);
  //   }
  // }

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
          convos: state.convos,
          unshiftMessagesToConvo,
          pushNewMessageToConvo,
          handleRemoveMessage,
          initConvo,
          onlineStatuses,
          addNewConvo,
          animationType,
          setAnimationType,
          shouldAnimate,
          setShouldAnimate,
          newMessage,
          setNewMessage,
        },
        removeConvo,
        activeConvoId: [state.activeConvoId, handleActiveConvoId],
      }}
    >
      {children}
    </AllConvoContext.Provider>
  );
}
