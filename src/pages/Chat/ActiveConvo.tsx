import { ActiveConvoContext } from "../../context/ActiveConvoContext";
import {
  MutableRefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import Message from "./Message";
import { useInView } from "react-intersection-observer";
import { socket } from "../../utils/socket";
import { debounce } from "lodash";
import { TMessage } from "../../types";

export default function ActiveConvo() {
  const [activeConvo, setActiveConvo] =
    useContext(ActiveConvoContext).convoContext;
  const [offset, setOffset] = useContext(ActiveConvoContext).offsetContext;
  const [offsetLoading, setOffsetLoading] =
    useContext(ActiveConvoContext).offsetLoading;
  const [activeConvoContext, setActiveConvoContext] =
    useContext(ActiveConvoContext).convoContext;

  // function* offsetGeneratorCreator(i: number) {
  //   while (true) {
  //     yield i;
  //     i += 1;
  //   }
  // }

  // let offsetGenerator: MutableRefObject<Generator<number, void, unknown>> =
  //   useRef(offsetGeneratorCreator(2));
  // console.log("offsetGenerator: ", offsetGenerator.current.next().value);

  const handleInView = useCallback(
    debounce((inView) => {
      console.log("offset: ", offset);
      if (inView) {
        socket.emit("msg:get-offset", {
          offset,
          convoId: activeConvoContext?.id,
        });

        setOffset((prev) => prev + 1);
      }
    }, 300),
    [activeConvoContext]
  );
  const [observeRef, inView] = useInView({
    onChange: handleInView,
  });

  useEffect(() => {
    socket.on("msg:send-offset", (data) => {
      console.log("Received data from socket:", data);
      console.log(
        "Current activeConvoContext before update:",
        activeConvoContext
      );
      if (!data) {
        return;
      }
      setActiveConvoContext((convoContext) => {
        const updatedContext = {
          ...convoContext,
          messages: [...data.data, ...convoContext.messages],
        };
        console.log("Updated activeConvoContext:", updatedContext);
        return updatedContext;
      });
    });
  }, []);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // let offsetLoadingLocal = false;
  console.log("inView: ", inView);

  useEffect(() => {
    if (offset == 2) {
      endOfMessagesRef.current?.scrollIntoView();
    }
  }, [activeConvoContext]);

  const messages = activeConvo?.messages?.map(
    ({ content, createdAt, sender }, i: number, msgs: TMessage[]) => {
      return (
        <>
          {i == 2 ? <div ref={observeRef} /> : null}
          <Message
            key={createdAt}
            content={content}
            createdAt={createdAt}
            username={sender.username}
          />
        </>
      );
    }
  );
  return (
    <div className="flex-grow p-4 overflow-y-auto">
      {/* {messages && <div ref={observeRef} />} */}
      {messages || null}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
