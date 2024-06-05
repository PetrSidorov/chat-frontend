import useRoomUsersStatus from "@/hooks/useRoomUsersStatus";
import {
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
} from "react";
import { TConvoContext, TConvo, TMessage } from "../types";
import { socket } from "../utils/socket";

export const AllConvoContext = createContext<TConvoContext>(null);

type AnimationType =
  | "enter"
  | "editMessage"
  | "remove"
  | "convoSwitch"
  | "disableAnimation";

type StateType = {
  convos: Record<string, TConvo> | null;
  animation: AnimationType;
  activeConvoId: string;
};

type ActionType =
  | { type: "initConvos"; data: Record<string, TConvo> }
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
      };
    }
  | {
      type: "activeConvoSwitch";
      data: {
        convoId: string;
        animation: AnimationType;
      };
    }
  | {
      type: "deleteMessage";
      data: {
        convoId: string;
        uuid: string;
        animation: AnimationType;
      };
    }
  | {
      type: "pushNewMessageToConvo";
      data: {
        convoId: string;
        message: TMessage;
        animation: AnimationType;
      };
    }
  | {
      type: "addNewConvo";
      data: {
        newConvo: Record<string, TConvo>;
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
        newMessages: TMessage[];
        id: string;
      };
    };

function convoReducer(state: StateType, action: ActionType): StateType {
  switch (action.type) {
    case "initConvos": {
      return {
        ...state,
        convos: action.data,
      };
    }
    case "editMessage": {
      const { convoId, messageEdited } = action.data;
      const updatedConvos = { ...state.convos };
      const updatedMessages = updatedConvos[convoId].messages.map(
        (message: TMessage) => {
          if (message.uuid == messageEdited.uuid) {
            return messageEdited;
          } else {
            return message;
          }
        }
      );
      updatedConvos[convoId].messages = updatedMessages;
      return {
        ...state,
        convos: updatedConvos,
      };
    }
    case "newMessage": {
      const { message, convoId, animation } = action.data;
      const updatedConvos = { ...state.convos };
      updatedConvos[convoId].messages = [
        ...(updatedConvos[convoId].messages || []),
        message,
      ];
      return {
        ...state,
        animation,
        convos: updatedConvos,
      };
    }
    case "activeConvoSwitch": {
      const { convoId: activeConvoId, animation } = action.data;
      return { ...state, activeConvoId, animation };
    }
    case "deleteMessage": {
      const {
        convoId,
        uuid: messageToDelete,

        animation,
      } = action.data;
      const updatedConvos = { ...state.convos };
      const updatedMessages = updatedConvos[convoId].messages.filter(
        ({ uuid }: { uuid: string }) => uuid !== messageToDelete
      );

      updatedConvos[convoId].messages = updatedMessages;
      return {
        ...state,
        convos: updatedConvos,
        animation,
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
        animation: "enter",
        convos: updatedConvos,
      };
    }
    case "addNewConvo": {
      const { newConvo } = action.data;
      return {
        ...state,
        convos: { ...state.convos, ...newConvo },
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
    default: {
      throw new Error(
        `Unexpected action ${JSON.stringify(action)} used in convo reducer`
      );
    }
  }
}

export default function ActiveConvoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, dispatch] = useReducer(convoReducer, {
    convos: null,
    animation: "enter",
    activeConvoId: "",
  });

  const [isConnected, setIsConnected] = useState(socket.connected);
  const onlineStatuses = useRoomUsersStatus();

  useEffect(() => {
    console.log("state.animation ", state.animation);
  }, [state.animation]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.on("connect", () => {
      setIsConnected(true);
      console.log("socket connected!!!!");
    });

    socket.on("msg:edit-return", ({ message: messageEdited, convoId }) => {
      handleMesageEdit({ messageEdited, convoId });
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
    socket.on("msg:delete:return", deleteMessage);

    return () => {
      socket.off("msg:return", handleNewMessage);
      socket.off("msg:delete:return", deleteMessage);
    };
  }, [state.activeConvoId]);

  const handleMesageEdit = ({
    messageEdited,
    convoId,
  }: {
    messageEdited: TMessage;
    convoId: string;
  }) => {
    // TODO: fix editing functionality
    dispatch({
      type: "editMessage",
      data: {
        messageEdited,
        convoId,
      },
    });
  };

  const initConvo = (data: Record<string, TConvo>) => {
    Object.keys(data).forEach((convoId) => socket.emit("room:join", convoId));
    dispatch({ type: "initConvos", data });
  };

  const handleNewMessage = ({
    message,
    convoId,
  }: {
    message: TMessage;
    convoId: string;
  }) => {
    // TODO: #ask-artem, one more 'just in case', do i need this?
    if (!state.convos?.[convoId]) return;
    dispatch({
      type: "newMessage",
      data: {
        animation: "enter",
        convoId,
        message,
      },
    });
  };

  const handleActiveConvoId = (id: string) => {
    if (state.activeConvoId === id) return;
    dispatch({
      type: "activeConvoSwitch",
      data: {
        convoId: id,
        animation: "disableAnimation",
      },
    });
  };

  //  TODO: (this shouldn't be called handleRemoveMessage in the first place)
  //  TODO: rename this, refactor if needed
  const handleRemoveMessage = (messageId: string) => {
    socket.emit("msg:delete", messageId);
    // TODO: optimistic updates ?
    // TODO add confirmation modal
  };

  const deleteMessage = ({
    convoId,
    uuid,
  }: {
    convoId: string;
    uuid: string;
  }) => {
    // TODO: #ask-artem should i even do that?
    // this check really seems like something 'just in case'
    if (!state.convos?.[convoId]) return;
    dispatch({
      type: "deleteMessage",
      data: {
        animation: "remove",
        convoId,
        uuid,
      },
    });
  };

  const pushNewMessageToConvo = (convoId: string, message: TMessage) => {
    dispatch({
      type: "pushNewMessageToConvo",
      data: {
        convoId,
        message,

        animation: "enter",
      },
    });
  };

  const addNewConvo = (newConvo: any) => {
    console.log("newConvo data ", newConvo);
    dispatch({
      type: "addNewConvo",
      data: {
        newConvo,
      },
    });
  };

  const removeConvo = (id: string) => {
    dispatch({
      type: "removeConvo",
      data: {
        convoId: id,
      },
    });
  };

  const unshiftMessagesToConvo = ({
    id,
    newMessages,
  }: {
    id: string;
    newMessages: TMessage[];
  }) => {
    dispatch({
      type: "unshiftMessagesToConvo",
      data: {
        newMessages,
        id,
      },
    });
  };

  function setAnimationType() {}

  useEffect(() => {
    console.log("convos changed in provider", state);
  }, [state]);

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
          animationType: state.animation,
          setAnimationType,
        },
        removeConvo,
        activeConvoId: [state.activeConvoId, handleActiveConvoId],
      }}
    >
      {children}
    </AllConvoContext.Provider>
  );
}
