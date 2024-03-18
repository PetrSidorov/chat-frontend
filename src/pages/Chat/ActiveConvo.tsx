import { useContext, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AllConvoContext } from "../../context/AllConvoContext";
import { socket } from "../../utils/socket";
import MessageList from "./MessageList";
import { AuthContext } from "../../context/AuthProvider";
import useOnlineStatus from "../../hooks/useNetworkStatus";
import IsOnline from "./sidebar/convos/IsOnline";
import { ChevronLeft } from "lucide-react";
import { ResizeContext } from "../../context/ResizeProvider";

export default function ActiveConvo() {
  const [activeConvoId, handleActiveConvoId] =
    useContext(AllConvoContext).activeConvoId;
  const { user } = useContext(AuthContext);
  const { convos, unshiftMessagesToConvo, handleRemoveMessage } =
    useContext(AllConvoContext).convoContext;
  const online = useOnlineStatus();
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { mobileView } = useContext(ResizeContext);
  const [blockOffset, setBlockOffset] = useState(false);
  // const onlineStatus = convos?.[activeConvoId]?.receiver.onlineStatus;
  const onlineStatus = false;

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
      if (!data || !scrollContainerRef.current || !activeConvoId) {
        return;
      }

      unshiftMessagesToConvo({ id: data.convoId, newMessages: data.messages });
      scrollContainerRef.current.scrollTop = savedScrollPosition;
    });
    setBlockOffset(false);
  }, [activeConvoId]);

  useEffect(() => {
    // TODO: i need scroll into view but on new message
    // (maybe on some other cases too)
    endOfMessagesRef.current?.scrollIntoView();
  }, [convos]);

  // function generateRemoveMessage(convoId: string) {
  //   return function removeMessage(messageIdToDelete: string) {
  //     handleRemoveMessage(convoId, messageIdToDelete);
  //   };
  // }

  // const startMessaging =
  //   convos && Object.keys(convos).length > 0 ? (
  //     <p>Select convo to start messaging</p>
  //   ) : (
  //     <p>You have no convos yet, find users and start messaging now</p>
  //   );

  return (
    <div
      ref={scrollContainerRef}
      className="flex flex-col flex-grow p-4 overflow-y-auto overflow-x-hidden"
    >
      <div className="w-[100%] h-10 bg-slate-600 fixed -mt-4 -ml-4 z-1 flex items-center">
        {/* classes for bottom IsOnline should be different */}
        {mobileView && (
          <button onClick={() => handleActiveConvoId(null)}>
            <ChevronLeft />
          </button>
        )}

        <div className="flex align-center justify-between w-[40%]">
          {/* <p>
              <span>{convos?.[activeConvoId].receiver.username}</span> is{" "}
              {onlineStatus ? "online" : "offline"}
            </p> */}
          <IsOnline online={onlineStatus} />
        </div>
      </div>
      {!online && <p>Waiting for network</p>}
      {user && Object.keys(user).length > 0 ? (
        <MessageList
          ref={observeRef}
          messages={convos?.[activeConvoId].messages}
          currentUser={{
            username: user.username,
            avatarUrl: user.avatarUrl,
            id: user.id,
          }}
          activeConvoId={activeConvoId}
          participants={convos?.[activeConvoId].participants}
          handleRemoveMessage={handleRemoveMessage}
        />
      ) : (
        "startMessaging"
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
