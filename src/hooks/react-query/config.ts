import getConvos from "@/utils/getConvos";
import getMessages from "./getMessages";
import { UseInfiniteQueryOptions } from "@tanstack/react-query";
import { GetMessagesResponse } from "@/types";

const infiniteConvosConfig = {
  queryKey: ["convo"],
  queryFn: ({ pageParam = 1 }) => getConvos(pageParam),
  initialPageParam: 1,
  getNextPageParam: (lastPage) => {
    const nextPage = lastPage.currentPage + 1;
    return nextPage <= lastPage.totalPages ? nextPage : undefined;
  },
};

const generateInfiniteMessagesConfig = (
  convoId: string
): UseInfiniteQueryOptions<GetMessagesResponse, Error> => {
  return {
    queryKey: ["messages", { convoId }],
    queryFn: ({ pageParam = 1 }) => getMessages(pageParam, convoId),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => {
      const nextPage = lastPage.currentPage + 1;
      return nextPage <= lastPage.totalPages ? nextPage : undefined;
    },
  };
};

export { infiniteConvosConfig, generateInfiniteMessagesConfig };
