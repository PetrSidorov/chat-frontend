import { useContext, useEffect, useRef } from "react";
import { useInView } from "react-intersection-observer";
import { AllConvoContext } from "../../context/AllConvoContext";
import { socket } from "../../utils/socket";
import MessageList from "./MessageList";
import { AuthContext } from "../../context/AuthProvider";
import useOnlineStatus from "../../hooks/useOnlineStatus";
import IsOnline from "./sidebar/convos/IsOnline";

export default function ActiveConvo() {
  const [activeConvoId] = useContext(AllConvoContext).activeConvoId;
  const [user] = useContext(AuthContext);
  const { convos, unshiftMessagesToConvo, handleRemoveMessage } =
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
    endOfMessagesRef.current?.scrollIntoView();
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
  }, [convos]);

  function generateRemoveMessage(convoId: string) {
    return function removeMessage(messageIdToDelete: string) {
      handleRemoveMessage(convoId, messageIdToDelete);
    };
  }

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col flex-grow p-4 overflow-y-auto"
    >
      {activeConvoId && (
        <div className="w-full h-10 bg-slate-600 fixed -mt-4 -ml-4 z-1">
          {/* classes for bottom IsOnline should be different */}
          Online <IsOnline online={convos?.[activeConvoId]?.online} />
        </div>
      )}
      {!online && <p>Waiting for network</p>}
      {activeConvoId &&
      convos?.[activeConvoId] &&
      user &&
      Object.keys(user).length > 0 ? (
        <MessageList
          ref={observeRef}
          messages={convos?.[activeConvoId].messages}
          currentUser={{
            username: user.username,
            avatarUrl: user.avatarUrl,
            id: user.id,
          }}
          activeConvoId={activeConvoId}
          receiver={convos?.[activeConvoId].receiver}
          handleRemoveMessage={generateRemoveMessage(activeConvoId)}
        />
      ) : (
        <p>Select convo to start messaging</p>
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
