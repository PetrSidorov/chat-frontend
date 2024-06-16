import {
  deleteRequest,
  postRequest,
  putRequest,
} from "@/api/axiosRequestHandler";
import { TMessage } from "@/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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
    mutationFn: () => putRequest(`/message/${id}`, { id, content }),
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
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["messages", { convoId }],
      });
    },
  });
};

export { useDeleteMessage, useEditMessage, useSendMessage };
