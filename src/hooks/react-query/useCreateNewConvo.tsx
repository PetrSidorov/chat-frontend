import { TConvo, TMessage } from "@/types";
import { socket } from "@/utils/socket";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

const createConvo = async (userId: string, joinerId: string) => {
  const response = await axios.post(
    "http://localhost:3007/api/convo",
    { content: userId, convoId: joinerId },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  return response.data;
};
// type TMessageToSend = Omit<TMessage, "createdAt">;
const useCreateConvo = (userId: string, joinerId: string) => {
  const queryClient = useQueryClient();
  //   placeholder
  const newConvo = {
    id: "6b391c4a-44db-428e-aeb2-61f2e5e01113",
    createdAt: "2024-06-03T18:29:29.317Z",
    updatedAt: "2024-06-03T18:29:29.317Z",
    lastMessageAt: "2024-06-03T18:29:29.317Z",
    name: null,
    isGroup: null,
    status: "PENDING",
    participants: [
      {
        id: "c515fdbe-5056-479a-930d-be1137a4986c",
        name: null,
        username: "Peter2",
        email: "piterpatrikk@gmail1.com",
        emailVerified: null,
        avatarUrl: null,
        // TODO: wat?
        password:
          "$2b$10$5WEun17zyqljJy.0F8SU/eRCrX4uW6ZtwqAvXk14wlR.Zy.shNRCm",
        createdAt: "2024-06-03T11:11:09.300Z",
        updatedAt: "2024-06-03T11:11:09.300Z",
      },
    ],
    messages: [
      {
        id: 392,
        content: "2",
        createdAt: "2024-06-15T12:04:05.225Z",
      },
    ],
  };
  return useMutation({
    mutationFn: () => createConvo(userId, joinerId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["convo"],
      });

      const snapshot = queryClient.getQueryData(["convo"]);
      queryClient.setQueryData(
        ["convo"],
        (oldData: InfiniteData<{ convos: TConvo[] }>) => {
          const newData = oldData ? [...oldData.pages] : [];
          newData[0].convos.unshift(newConvo);
          return {
            ...oldData,
            pages: newData,
          };
        }
      );

      return () => {
        queryClient.setQueryData(["convo"], snapshot);
      };
    },
    onError: (error, variables, rollback) => {
      console.log("error", error);
      rollback?.();
    },
    onSettled: () => {
      return queryClient.invalidateQueries({
        queryKey: ["convo"],
      });
    },
  });
};

export default useCreateConvo;
