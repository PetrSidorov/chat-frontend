import useGetUser from "@/hooks/react-query/useGetUser";
import { ChevronLeft } from "lucide-react";
import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AllConvoContext } from "../../context/AllConvoProvider";
import { ResizeContext } from "../../context/ResizeProvider";
import useOnlineStatus from "../../hooks/useNetworkStatus";
import { socket } from "../../utils/socket";
import MessageList from "./MessageList";
import IsOnline from "./sidebar/convos/IsOnline";
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { generateInfiniteMessagesConfig } from "@/hooks/react-query/config";
import FullScreenLoading from "@/components/FullScreenLoading";
import getMessages from "@/hooks/react-query/getMessages";
import Message from "./message/Message";
import MessageContextMenu from "./sidebar/convos/MessageContextMenu";
import MonthAndYear from "./message/MonthAndYear";
import isSameDayAsPreviousMessage from "@/utils/isSameDayAsPreviousMessage";
import React from "react";
import { flattenMessages } from "@/utils/flattenMessages";
// TODO:active convo - error when convos are deleted (sometimes)
export default function ActiveConvo() {
  const queryClient = useQueryClient();
  const [convoId, handleActiveConvoId] =
    useContext(AllConvoContext).activeConvoId;

  const { user } = useGetUser();
  const { fullWidthMessagesInActiveConvo } = useContext(ResizeContext);
  const rootRef = React.useRef(null);

  // const {
  //   convos,
  //   unshiftMessagesToConvo,
  //   handleRemoveMessage,
  //   onlineStatuses,
  // } = useContext(AllConvoContext).convoContext;
  // const userOnlineStatus = useOnlineStatus();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { mobileView } = useContext(ResizeContext);

  // const [blockOffset, setBlockOffset] = useState(false);
  // const participantOnlineStatus = onlineStatuses[activeConvoId]?.includes(
  //   convos[activeConvoId]?.participants[0].id
  // );
  // const lastMessageIndex = convos[activeConvoId].messages.length - 1;
  // const lastMessage = convos[activeConvoId].messages[lastMessageIndex];

  // TODO: this should be memoized on another level

  const id = useMemo(() => convoId, [convoId]);

  // const { ref } = useInView({
  //   threshold: 0,
  //   root: rootRef.current,
  //   rootMargin: "40px",
  //   onChange: (inView) => {
  //     fetchNextPage();
  //   },
  // });

  const {
    data,
    isFetching,
    isLoading,
    isError,
    hasNextPage,
    hasPreviousPage,
    isFetchingPreviousPage,
    isFetchingNextPage,
    status,
    fetchNextPage,
    fetchPreviousPage,
    isSuccess,
  } = useInfiniteQuery({
    queryKey: ["messages", { id }],
    queryFn: ({ pageParam = 1 }) => getMessages(pageParam, id),
    initialPageParam: 1,
    enabled: !!id,

    getNextPageParam: ({ currentPage, totalPages }) => {
      console.log("currentPage totalPages ", currentPage, totalPages);
      const nextPage = currentPage + 1;
      return nextPage <= totalPages ? nextPage : undefined;
    },
    getPreviousPageParam: ({ currentPage }) => {
      const previousPage = currentPage - 1;
      return previousPage > 0 ? previousPage : undefined;
    },
    // select: (data) => {
    //   // Reverse the order of pages to show them correctly
    //   return {
    //     pages: data.pages.reverse(),
    //     pageParams: data.pageParams.reverse(),
    //   };
    // },
  });
  const messages = flattenMessages(data?.pages);
  const { ref } = useInView({
    threshold: 0,
    root: rootRef.current,
    // rootMargin: "40px",
    onChange: (inView) => {
      if (inView && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
      // if (inView && hasPreviousPage && !isFetchingPreviousPage) {
      //   fetchPreviousPage();
      // }
    },
  });

  // function emitGettingOffset(currentlyInView: boolean) {
  //   if (!currentlyInView) return;

  //   socket.emit("msg:get-offset", {
  //     uuid: convos?.[activeConvoId]?.messages[0].uuid,
  //     convoId: activeConvoId,
  //   });
  //   setBlockOffset(true);
  // }

  // const [observeRef] = useInView({
  //   onChange: emitGettingOffset,
  // });

  // useEffect(() => {
  //   if (!scrollContainerRef.current) return;
  //   if (blockOffset) return;

  //   socket.on("msg:send-offset", (data) => {
  //     if (!data || !scrollContainerRef.current || !activeConvoId) return;

  //     unshiftMessagesToConvo({ id: data.convoId, newMessages: data.messages });
  //   });
  //   setBlockOffset(false);
  // }, [activeConvoId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView();
  }, [isSuccess]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (isError) {
    return <div>Error fetching data 😔</div>;
  }

  if (isFetching) {
    return <div>Fetching data in progress 😔</div>;
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
            onClick={() => handleActiveConvoId(null)}
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

      {user && Object.keys(user).length > 0 ? (
        messages.map(
          ({ content, createdAt, sender, uuid }, i: number, messages) => {
            const yours = sender.id == user.id;

            // const avatarUrl = yours
            //   ? user.avatarUrl
            //   : participants[0]?.avatarUrl || null;
            const avatarUrl = user.avatarUrl;

            const alignment = yours ? "self-start" : "self-end";

            function handleRemoveMessage(uuid: any) {
              throw new Error("Function not implemented.");
            }

            return (
              <React.Fragment key={uuid}>
                {i === 3 ? <div ref={ref} /> : null}
                {/* {hasNextPage && i === 3 && <li ref={ref} />} */}
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
                        handleRemoveMessage={() => handleRemoveMessage(uuid)}
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
        )
      ) : (
        <p className="text-center my-2">
          Start messaging by selecting a conversation
        </p>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
