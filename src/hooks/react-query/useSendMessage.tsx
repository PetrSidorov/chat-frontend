import { TMessage } from "@/types";
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
type TMessageToSend = Omit<TMessage, "createdAt">;
const useSendMessage = (convoId: string, newMessage: TMessageToSend) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => sendMessage(newMessage.content, convoId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["messages", { id: convoId }],
      });

      const snapshot = queryClient.getQueryData(["messages", { convoId }]);
      queryClient.setQueryData(
        ["messages", { convoId }],
        (
          oldData: InfiniteData<{ messages: (TMessageToSend | TMessage)[] }>
        ) => {
          console.log("good old dta ", oldData);
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

export default useSendMessage;
