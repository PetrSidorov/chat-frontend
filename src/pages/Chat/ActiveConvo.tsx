import { useContext, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AllConvoContext } from "../../context/AllConvoProvider";
import { socket } from "../../utils/socket";
import MessageList from "./MessageList";
import { AuthContext } from "../../context/AuthProvider";
import useOnlineStatus from "../../hooks/useNetworkStatus";
import IsOnline from "./sidebar/convos/IsOnline";
import { ChevronLeft } from "lucide-react";
import { ResizeContext } from "../../context/ResizeProvider";

export default function ActiveConvo({ initialLoad }: { initialLoad: boolean }) {
  const [activeConvoId, handleActiveConvoId] =
    useContext(AllConvoContext).activeConvoId;
  const { user } = useContext(AuthContext);
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
    convos[activeConvoId].participants[0].id
  );

  function emitGettingOffset(currentlyInView: boolean) {
    if (!currentlyInView) return;

    socket.emit("msg:get-offset", {
      currMessagesLength: convos?.[activeConvoId]?.messages.length,
      convoId: activeConvoId,
    });
    setBlockOffset(true);
  }

  const [observeRef, inView] = useInView({
    onChange: emitGettingOffset,
  });

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView();
    if (!scrollContainerRef.current) return;
    if (blockOffset) return;
    const savedScrollPosition = scrollContainerRef.current.scrollTop;

    socket.on("msg:send-offset", (data) => {
      if (!data || !scrollContainerRef.current || !activeConvoId) return;

      unshiftMessagesToConvo({ id: data.convoId, newMessages: data.messages });
      scrollContainerRef.current.scrollTop = savedScrollPosition;
    });
    setBlockOffset(false);
  }, [activeConvoId]);

  useEffect(() => {
    initialLoad && endOfMessagesRef.current?.scrollIntoView();
  }, [initialLoad]);

  if (!convos[activeConvoId])
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden"
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
