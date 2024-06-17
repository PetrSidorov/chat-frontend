import getMessages from "@/hooks/react-query/getMessages";
import useGetUser from "@/hooks/react-query/useGetUser";
import useActiveConvoIdStore from "@/store";
import { flattenInfiniteData } from "@/utils/flattenInfiniteData";
import isSameDayAsPreviousMessage from "@/utils/isSameDayAsPreviousMessage";
import {
  InfiniteData,
  useInfiniteQuery,
  UseInfiniteQueryResult,
  useQueryClient,
} from "@tanstack/react-query";
import { ChevronLeft } from "lucide-react";
import React, { useContext, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { ResizeContext } from "../../context/ResizeProvider";
import Message from "./message/Message";
import MonthAndYear from "./message/MonthAndYear";
import MessageContextMenu from "./sidebar/convos/MessageContextMenu";
import { TMessage, TPage } from "@/types";

export default function ActiveConvo() {
  const queryClient = useQueryClient();
  const activeConvoId = useActiveConvoIdStore((state) => state.activeConvoId);
  const handleActiveConvoId = useActiveConvoIdStore(
    (state) => state.updateActiveConvoId
  );

  const { user } = useGetUser();
  const { fullWidthMessagesInActiveConvo } = useContext(ResizeContext);
  const rootRef = React.useRef(null);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { mobileView } = useContext(ResizeContext);

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    isSuccess,
  }: UseInfiniteQueryResult<InfiniteData<TPage<TMessage>>> = useInfiniteQuery({
    queryKey: ["messages", { convoId: activeConvoId }],
    queryFn: ({ pageParam = 1 }) =>
      getMessages(pageParam as number, activeConvoId),
    initialPageParam: 1,
    enabled: !!activeConvoId,
    initialData: queryClient.getQueryData([
      "messages",
      { convoId: activeConvoId },
    ]) as InfiniteData<TPage<TMessage>>,
    getNextPageParam: ({
      currentPage,
      totalPages,
    }: {
      currentPage: number;
      totalPages: number;
    }) => {
      const nextPage = currentPage + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    getPreviousPageParam: ({ currentPage }) => {
      const previousPage = currentPage - 1;
      return previousPage > 0 ? previousPage : undefined;
    },
  });

  const messages = flattenInfiniteData(data?.pages);
  const lastMessaageId = data?.pages[0]?.messages[0]?.uuid;

  const { ref } = useInView({
    threshold: 0,
    root: rootRef.current,
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
  });

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView();
  }, [isSuccess, lastMessaageId]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (isError) {
    return <div>Error fetching data 😔</div>;
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col flex-grow overflow-y-scroll overflow-x-hidden"
    >
      <div className="sticky top-0 bg-slate-600 p-2 z-10 flex items-center justify-between">
        {mobileView && (
          <button
            className="text-white"
            onClick={() => handleActiveConvoId(activeConvoId)}
          >
            <ChevronLeft size={24} />
          </button>
        )}

        <div className="flex items-center justify-between flex-grow">
          <p className="text-white">
            {/* <span>{convos?.[activeConvoId].participants[0].username}</span> is{" "} */}
            {/* <span
              className={`${
                participantOnlineStatus ? "text-green-500" : "text-red-500"
              }`}
            >
              {participantOnlineStatus ? "online" : "offline"}
            </span> */}
          </p>
          {/* <IsOnline online={participantOnlineStatus} /> */}
        </div>
      </div>
      {/* {!userOnlineStatus && (
        <p className="text-center my-2">Waiting for network...</p>
      )} */}
      {messages?.map(
        ({ content, createdAt, sender, uuid }, i: number, messages) => {
          const yours = sender.id == user?.id;

          // const avatarUrl = yours
          //   ? user.avatarUrl
          //   : participants[0]?.avatarUrl || null;
          const avatarUrl = user?.avatarUrl;

          const alignment = yours ? "self-start" : "self-end";

          return (
            <React.Fragment key={uuid}>
              {hasNextPage && i === 3 && <div ref={ref} />}
              {!isSameDayAsPreviousMessage(
                createdAt,
                messages[i - 1]?.createdAt || ""
              ) && <MonthAndYear createdAt={createdAt} />}
              <div
                id={uuid}
                className={`${alignment} ${
                  fullWidthMessagesInActiveConvo ? "w-full" : "w-[80%]"
                }`}
              >
                <Message
                  content={content}
                  createdAt={createdAt}
                  popup={
                    <MessageContextMenu
                      yours={yours}
                      content={content}
                      uuid={uuid}
                    />
                  }
                  username={sender.username}
                  avatarUrl={avatarUrl}
                  prevMessageSender={messages[i - 1]?.sender?.username || ""}
                />
              </div>
            </React.Fragment>
          );
        }
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
