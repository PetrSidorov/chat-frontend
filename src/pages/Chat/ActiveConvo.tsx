import { useContext, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { AllConvoContext } from "../../context/AllConvoContext";
import { socket } from "../../utils/socket";
import MessageList from "./MessageList";
import { AuthContext } from "../../context/AuthProvider";
import useOnlineStatus from "../../hooks/useOnlineStatus";

export default function ActiveConvo() {
  const [activeConvoId] = useContext(AllConvoContext).activeConvoId;
  const [user] = useContext(AuthContext);
  const { convos, unshiftMessagesToConvo } =
    useContext(AllConvoContext).convoContext;
  const online = useOnlineStatus();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const offset = convos?.[activeConvoId]?.messages.length / 6 || 2;

  function emitGettingOffset(currentlyInView: boolean) {
    if (!currentlyInView) return;

    socket.emit("msg:get-offset", {
      offset,
      convoId: activeConvoId,
    });
  }

  const [observeRef, inView] = useInView({
    onChange: emitGettingOffset,
  });

  useEffect(() => {
    if (!scrollContainerRef.current) return;
    const savedScrollPosition = scrollContainerRef.current.scrollTop;

    socket.on("msg:send-offset", (data) => {
      if (!data || !scrollContainerRef.current || !activeConvoId) {
        return;
      }

      unshiftMessagesToConvo({ id: activeConvoId, newMessages: data.data });
      scrollContainerRef.current.scrollTop = savedScrollPosition;
    });
  }, [activeConvoId]);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView();
  }, [activeConvoId, convos]);

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col flex-grow p-4 overflow-y-auto"
    >
      {!online && <p>Waiting for network</p>}
      {activeConvoId && convos?.[activeConvoId] ? (
        <MessageList
          ref={observeRef}
          messages={convos?.[activeConvoId].messages}
          currentUser={user?.username}
          actors={convos?.[activeConvoId].actors}
        />
      ) : (
        <p>Select convo to start messaging</p>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
