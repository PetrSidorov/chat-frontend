import { useContext, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AllConvoContext } from "../../context/AllConvoContext";
import { socket } from "../../utils/socket";
import MessageList from "./MessageList";

export default function ActiveConvo() {
  const [activeConvoId] = useContext(AllConvoContext).activeConvoId;

  const { convos, addOffsetMessagesToConvo } =
    useContext(AllConvoContext).convoContext;

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const offset = convos?.[activeConvoId]?.length / 6 || 2;
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
    socket.on("msg:send-offset", (data) => {
      if (!data || !scrollContainerRef.current || !activeConvoId) {
        return;
      }
      const savedScrollPosition = scrollContainerRef.current.scrollTop;
      addOffsetMessagesToConvo({ id: activeConvoId, newMessages: data.data });
      scrollContainerRef.current.scrollTop = savedScrollPosition;
    });
  }, [activeConvoId]);

  useEffect(() => {
    if (offset == 2) {
      endOfMessagesRef.current?.scrollIntoView();
    }
  }, [activeConvoId]);

  return (
    <div ref={scrollContainerRef} className="flex-grow p-4 overflow-y-auto">
      {convos?.[activeConvoId] ? (
        <MessageList ref={observeRef} messages={convos?.[activeConvoId]} />
      ) : (
        "Please, try refresh the page"
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
