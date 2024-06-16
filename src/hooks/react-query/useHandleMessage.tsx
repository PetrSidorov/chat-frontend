import {
  deleteRequest,
  postRequest,
  putRequest,
} from "@/api/axiosRequestHandler";
import { TMessage } from "@/types";
import { socket } from "@/utils/socket";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

const sendMessage = async (content: string, convoId: string) => {
  const response = await axios.post(
    "http://localhost:3007/api/message",
    { content, convoId },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};

const deleteMessage = async (id: string) => {
  const response = await axios.delete(
    `http://localhost:3007/api/message/${id}`,
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

const editMessage = async (id: string, content: string) => {
  console.log("uooo");
  const response = await axios.put(
    `http://localhost:3007/api/message/${id}`,
    { id, content },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

type TMessageToSend = Omit<TMessage, "createdAt">;
const useSendMessage = (convoId: string, newMessage: TMessageToSend) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      postRequest("/message", { content: newMessage.content, convoId }),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["messages", { convoId }],
      });

      const snapshot = queryClient.getQueryData(["messages", { convoId }]);
      queryClient.setQueryData(
        ["messages", { convoId }],
        (
          oldData: InfiniteData<{ messages: (TMessageToSend | TMessage)[] }>
        ) => {
          const newData = oldData ? [...oldData.pages] : [];
          newData[0].messages.unshift(newMessage);
          return {
            ...oldData,
            pages: newData,
          };
        }
      );

      return () => {
        queryClient.setQueryData(["messages", { convoId }], snapshot);
      };
    },
    onError: (error, variables, rollback) => {
      console.log("error", error);
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["messages", { convoId }],
      });
    },
  });
};

const useDeleteMessage = (convoId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteRequest(`/message/${id}`),
    onMutate: async (uuid) => {
      await queryClient.cancelQueries({
        queryKey: ["messages", { convoId }],
      });

      const snapshot = queryClient.getQueryData(["messages", { convoId }]);

      queryClient.setQueryData(
        ["messages", { convoId }],
        (oldData: InfiniteData<{ messages: TMessage[] }>) => {
          const newData = oldData
            ? { ...oldData }
            : { pages: [{ messages: [] }] };
          newData.pages[0].messages = newData.pages[0].messages.filter(
            (msg) => msg.uuid !== uuid
          );
          return newData;
        }
      );

      return () => {
        queryClient.setQueryData(["messages", { convoId }], snapshot);
      };
    },
    onError: (error, messageId, rollback) => {
      console.log("error", error);
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["messages", { convoId }],
      });
    },
  });
};

const useEditMessage = (convoId: string, id: string, content: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    // mutationFn: () => editMessage(id, content),
    mutationFn: () => putRequest(`message/${id}`, { id, content }),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["messages", { convoId }],
      });

      const snapshot = queryClient.getQueryData(["messages", { convoId }]);
      queryClient.setQueryData(
        ["messages", { convoId }],
        (oldData: InfiniteData<{ messages: TMessage[] }>) => {
          const newData = oldData ? [...oldData.pages] : [];
          newData[0].messages.map((message) =>
            message.uuid == id ? { ...message, content } : message
          );
          return {
            ...oldData,
            pages: newData,
          };
        }
      );

      return () => {
        queryClient.setQueryData(["messages", { convoId }], snapshot);
      };
    },
    onError: (error, variables, rollback) => {
      console.log("error", error);
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["messages", { convoId }],
      });
    },
  });
};

export { useSendMessage, useDeleteMessage, useEditMessage };

// import { useMutation, useQueryClient } from "@tanstack/react-query";
// import {
//   sendRequest,
//   deleteRequest,
//   putRequest,
// } from "@/api/axiosRequestHandler";
// import { TMessage } from "@/types";

// const useSendMessage = (convoId: string, newMessageContent: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: () =>
//       sendRequest<void>("post", `/api/message`, {
//         content: newMessageContent,
//         convoId,
//       }),
//     onSettled: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["messages", { convoId }],
//       });
//     },
//   });
// };

// const useDeleteMessage = (convoId: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => deleteRequest<void>(`/api/message/${id}`),
//     onSettled: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["messages", { convoId }],
//       });
//     },
//   });
// };

// const useEditMessage = (convoId: string, id: string, content: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string, content: string) =>
//       putRequest<void>(`/api/message/${id}`, { convoId, content }),
//     onSettled: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["messages", { convoId }],
//       });
//     },
//   });
// };

// export { useSendMessage, useDeleteMessage, useEditMessage };
