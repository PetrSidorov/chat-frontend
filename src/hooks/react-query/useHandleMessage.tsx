import {
  deleteRequest,
  postRequest,
  putRequest,
} from "@/api/axiosRequestHandler";
import { TDataKey, TMessage, TMessageToSend, TUserInteraction } from "@/types";
import {
  InfiniteData,
  MutationFunction,
  QueryKey,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";

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

  // return useMutation({
  //   mutationFn: (id: string) => deleteRequest(`/message/${id}`),
  //   onMutate: async (uuid) => {
  //     await queryClient.cancelQueries({
  //       queryKey: ["messages", { convoId }],
  //     });

  //     const snapshot = queryClient.getQueryData(["messages", { convoId }]);

  //     queryClient.setQueryData(
  //       ["messages", { convoId }],
  //       (oldData: InfiniteData<{ messages: TMessage[] }>) => {
  //         const newData = oldData
  //           ? { ...oldData }
  //           : { pages: [{ messages: [] }] };
  //         newData.pages[0].messages = newData.pages[0].messages.filter(
  //           (msg) => msg.uuid !== uuid
  //         );
  //         return newData;
  //       }
  //     );

  //     return () => {
  //       queryClient.setQueryData(["messages", { convoId }], snapshot);
  //     };
  //   },
  //   onError: (error, messageId, rollback) => {
  //     console.log("error", error);
  //     rollback?.();
  //   },
  //   onSettled: () => {
  //     return queryClient.invalidateQueries({
  //       queryKey: ["messages", { convoId }],
  //     });
  //   },
  // });
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

const generateUseMutation = <T,>(
  // TODO #ask-artem all check somehow in total typescript
  // are types in this function are ok ?
  mutationFn: MutationFunction<unknown, string>,
  queryKey: QueryKey,
  setQueryDataFn: (args: InfiniteData<T>, options?: string) => {}
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    // #ask-artem why typescript in the line below
    // doesn't let me to do anything aside from any
    onMutate: async (options?: any) => {
      await queryClient.cancelQueries({
        queryKey,
      });

      const snapshot = queryClient.getQueryData(queryKey);

      queryClient.setQueryData(queryKey, (args: InfiniteData<T>) =>
        setQueryDataFn(args, options)
      );

      return () => {
        queryClient.setQueryData(queryKey, snapshot);
      };
    },
    onError: (error, _, rollback) => {
      console.log("error", error);
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey,
      });
    },
  });
};

export { useDeleteMessage, useEditMessage, useSendMessage };
