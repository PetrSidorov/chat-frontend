import { useContext, useEffect, useMemo, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AllConvoContext } from "../../context/AllConvoProvider";
import { socket } from "../../utils/socket";
import MessageList from "./MessageList";
import { AuthContext } from "../../context/AuthProvider";
import useOnlineStatus from "../../hooks/useNetworkStatus";
import IsOnline from "./sidebar/convos/IsOnline";
import { ChevronLeft } from "lucide-react";
import { ResizeContext } from "../../context/ResizeProvider";
import useGetUser from "@/hooks/react-query/useGetUser";
// TODO:active convo - error when convos are deleted (sometimes)
export default function ActiveConvo() {
  const [activeConvoId, handleActiveConvoId] =
    useContext(AllConvoContext).activeConvoId;
  // const { user } = useContext(AuthContext);
  //   convo.id  6b391c4a-44db-428e-aeb2-61f2e5e01113
  // ConvosList.tsx:136 convo.id  7f77c47c-92af-4702-9c6e-d66f14e70860

  const { user } = useGetUser();
  const {
    convos,
    unshiftMessagesToConvo,
    handleRemoveMessage,
    onlineStatuses,
  } = useContext(AllConvoContext).convoContext;
  const userOnlineStatus = useOnlineStatus();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { mobileView } = useContext(ResizeContext);
  const [blockOffset, setBlockOffset] = useState(false);
  const participantOnlineStatus = onlineStatuses[activeConvoId]?.includes(
    convos[activeConvoId]?.participants[0].id
  );
  const lastMessageIndex = convos[activeConvoId].messages.length - 1;
  const lastMessage = convos[activeConvoId].messages[lastMessageIndex];

  function emitGettingOffset(currentlyInView: boolean) {
    if (!currentlyInView) return;

    socket.emit("msg:get-offset", {
      // currMessagesLength: convos?.[activeConvoId]?.messages.length,
      uuid: convos?.[activeConvoId]?.messages[0].uuid,
      // timestamp:
      //   convos?.[activeConvoId]?.messages[
      //     convos?.[activeConvoId]?.messages.length - 1
      //   ],
      convoId: activeConvoId,
    });
    setBlockOffset(true);
  }

  const [observeRef] = useInView({
    onChange: emitGettingOffset,
  });

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    if (blockOffset) return;

    socket.on("msg:send-offset", (data) => {
      if (!data || !scrollContainerRef.current || !activeConvoId) return;

      unshiftMessagesToConvo({ id: data.convoId, newMessages: data.messages });
    });
    setBlockOffset(false);
  }, [activeConvoId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView();
  }, [activeConvoId, lastMessage.uuid]);

  if (!convos[activeConvoId]) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
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
            <span>{convos?.[activeConvoId].participants[0].username}</span> is{" "}
            <span
              className={`${
                participantOnlineStatus ? "text-green-500" : "text-red-500"
              }`}
            >
              {participantOnlineStatus ? "online" : "offline"}
            </span>
          </p>
          <IsOnline online={participantOnlineStatus} />
        </div>
      </div>
      {!userOnlineStatus && (
        <p className="text-center my-2">Waiting for network...</p>
      )}

      {user && Object.keys(user).length > 0 ? (
        <MessageList
          ref={observeRef}
          messages={convos?.[activeConvoId]?.messages || []}
          currentUser={{
            username: user.username,
            avatarUrl: user.avatarUrl,
            id: user.id,
          }}
          activeConvoId={activeConvoId}
          participants={convos?.[activeConvoId]?.participants}
          handleRemoveMessage={handleRemoveMessage}
        />
      ) : (
        <p className="text-center my-2">
          Start messaging by selecting a conversation
        </p>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
