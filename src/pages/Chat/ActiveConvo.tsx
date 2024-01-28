import { useContext, useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { AllConvoContext } from "../../context/AllConvoContext";
import { socket } from "../../utils/socket";
import MessageList from "./MessageList";

export default function ActiveConvo() {
  const [activeConvoId] = useContext(AllConvoContext).activeConvoId;
  // const [offset, setOffset] = useContext(AllConvoContext).offsetContext;
  const [offset, setOffset] = useState(2);
  const [convos, addMessagesToConvo] = useContext(AllConvoContext).convoContext;
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function emitGettingOffset(currentlyInView: boolean) {
    if (!currentlyInView) return;

    socket.emit("msg:get-offset", {
      offset,
      convoId: activeConvoId,
    });

    setOffset((prev) => prev + 1);
  }

  const [observeRef, inView] = useInView({
    onChange: emitGettingOffset,
  });

  useEffect(() => {
    socket.on("msg:send-offset", (data) => {
      // if (!data || !scrollContainerRef.current) {
      //   return;
      // }
      // const savedScrollPosition = scrollContainerRef.current.scrollTop;
      // if (!data) {
      //   return;
      // }
      console.log("data ", data);
      // addMessagesToConvo(activeConvoId, data.data);
      // setActiveConvoContext((convoContext) => {
      //   const updatedContext = {
      //     ...convoContext,
      //     messages: [...data.data, ...convoContext.messages],
      //   };
      //   console.log("Updated activeConvoContext:", updatedContext);
      //   return updatedContext;
      // });
      // scrollContainerRef.current.scrollTop = savedScrollPosition;
    });
  }, []);

  useEffect(() => {
    if (offset == 2) {
      endOfMessagesRef.current?.scrollIntoView();
    }
  }, [activeConvoId]);

  return (
    <div ref={scrollContainerRef} className="flex-grow p-4 overflow-y-auto">
      {convos?.[activeConvoId] ? (
        <MessageList
          ref={observeRef}
          messages={convos?.[activeConvoId]}
          // activeConvo={{
          //   // id: activeConvo?.id,
          //   messages: convos?.[activeConvoId],
          // }}
        />
      ) : (
        "Please, try refresh the page"
      )}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
