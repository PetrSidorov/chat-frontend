import {
  deleteRequest,
  postRequest,
  putRequest,
} from "@/api/axiosRequestHandler";
import { TMessage, TMessageToSend } from "@/types";
import { InfiniteData } from "@tanstack/react-query";
import { generateUseMutation } from "./generateUseMutation";

const useSendMessage = (convoId: string, newMessage: TMessageToSend) => {
  const setQueryDataFn = (
    oldData: InfiniteData<{ messages: (TMessageToSend | TMessage)[] }>
  ) => {
    const newData = oldData ? [...oldData.pages] : [];
    newData[0].messages.unshift(newMessage);
    return {
      ...oldData,
      pages: newData,
    };
  };

  return generateUseMutation(
    () => postRequest("/message", { content: newMessage.content, convoId }),
    ["messages", { convoId }],
    setQueryDataFn
  );
};

const useDeleteMessage = (convoId: string) => {
  const setQueryDataFn = (
    oldData: InfiniteData<{ messages: TMessage[] }>,
    uuid?: string
  ) => {
    if (!uuid) {
      throw new Error("No options provided, expected to have UUID.");
    }

    if (typeof uuid !== "string") {
      throw new Error("UUID is required and must be a string.");
    }

    const newData = oldData ? { ...oldData } : { pages: [{ messages: [] }] };
    newData.pages[0].messages = newData.pages[0].messages.filter(
      (msg) => msg.uuid !== uuid
    );
    return newData;
  };

  return generateUseMutation(
    (id: string) => deleteRequest(`/message/${id}`),
    ["messages", { convoId }],
    setQueryDataFn
  );
};

const useEditMessage = (convoId: string, id: string, content: string) => {
  const setQueryDataFn = (oldData: InfiniteData<{ messages: TMessage[] }>) => {
    const newData = oldData ? [...oldData.pages] : [];
    newData[0].messages.map((message) =>
      message.uuid == id ? { ...message, content } : message
    );
    return {
      ...oldData,
      pages: newData,
    };
  };

  return generateUseMutation(
    () => putRequest(`/message/${id}`, { id, content }),
    ["messages", { convoId }],
    setQueryDataFn
  );
};

export { useDeleteMessage, useEditMessage, useSendMessage };
