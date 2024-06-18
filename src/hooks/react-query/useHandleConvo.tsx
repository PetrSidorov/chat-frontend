import { deleteRequest } from "@/api/axiosRequestHandler";
import { TConvo } from "@/types";
import {
  InfiniteData,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import axios from "axios";

const createConvo = async (userId: string, joinerId: string) => {
  const response = await axios.post(
    "http://localhost:3007/api/convo",
    { userId, joinerId },
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
const useCreateConvo = (userId: string) => {
  const queryClient = useQueryClient();
  //  TODO: remove placeholder data and replace it with actual data

  const newConvo = {
    id: "6b391c4a-44db-428e-aeb2-61f2e5e01113",
    // createdAt: "2024-06-03T18:29:29.317Z",
    // updatedAt: "2024-06-03T18:29:29.317Z",
    // lastMessageAt: "2024-06-03T18:29:29.317Z",
    // name: "",
    // isGroup: false,
    // status: "PENDING",
    participants: [
      {
        id: "c515fdbe-5056-479a-930d-be1137a4986c",
        name: "",
        username: "Peter2",
        avatarUrl: "",
        email: "",
      },
    ],
    messages: [
      {
        name: "",
        uuid: "",
        content: "",
        createdAt: "",
        sender: {
          username: "",
          id: "",
        },
      },
    ],
  };
  return useMutation({
    mutationFn: (joinerId: string) => createConvo(userId, joinerId),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: ["convos"],
      });

      const snapshot = queryClient.getQueryData(["convo"]);
      queryClient.setQueryData(
        ["convo"],
        (oldData: InfiniteData<{ convos: TConvo[] }>) => {
          const newData = oldData ? [...oldData.pages] : [];

          newData[0].convos.push(newConvo);
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
        queryKey: ["convos"],
      });
    },
  });
};

// const useDeleteConvo = (convoId: string) => {
//   const queryClient = useQueryClient();

//   return useMutation({
//     mutationFn: (id: string) => deleteRequest(`/convo/${id}`),
//     onMutate: async (uuid) => {
//       await queryClient.cancelQueries({
//         queryKey: ["messages", { convoId }],
//       });

//       const snapshot = queryClient.getQueryData(["messages", { convoId }]);

//       queryClient.setQueryData(
//         ["messages", { convoId }],
//         (oldData: InfiniteData<{ messages: TMessage[] }>) => {
//           const newData = oldData
//             ? { ...oldData }
//             : { pages: [{ messages: [] }] };
//           newData.pages[0].messages = newData.pages[0].messages.filter(
//             (msg) => msg.uuid !== uuid
//           );
//           return newData;
//         }
//       );

//       return () => {
//         queryClient.setQueryData(["messages", { convoId }], snapshot);
//       };
//     },
//     onError: (error, messageId, rollback) => {
//       console.log("error", error);
//       rollback?.();
//     },
//     onSettled: () => {
//       return queryClient.invalidateQueries({
//         queryKey: ["messages", { convoId }],
//       });
//     },
//   });
// };

export { useCreateConvo };
