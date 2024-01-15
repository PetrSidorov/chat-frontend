import { ActiveConvoContext } from "../../context/ActiveConvoContext";
import { useContext, useEffect, useRef, useState } from "react";
import Message from "./Message";
import { useInView } from "react-intersection-observer";
import { socket } from "../../utils/socket";

export default function ActiveConvo() {
  const [activeConvo, setActiveConvo] =
    useContext(ActiveConvoContext).convoContext;
  const [offset, setOffset] = useContext(ActiveConvoContext).offsetContext;
  const [offsetLoading, setOffsetLoading] =
    useContext(ActiveConvoContext).offsetLoading;
  const [activeConvoContext, setActiveConvoContext] =
    useContext(ActiveConvoContext).convoContext;
  const [render, setRender] = useState(0);
  const [observeRef, inView, entry] = useInView({
    onChange(inView) {
      setRender((prev) => prev + 1);
      console.log("render", render);
      // if (inView && render == 1) {
      //   socket.emit("msg:get-offset", {
      //     offset: 12,
      //     convoId: activeConvoContext?.id,
      //   });
      // }
      // setOffsetLoading(inView);
    },
  });

  useEffect(() => {
    socket.on("msg:send-offset", (data) => {
      // console.log("msg:send-offset", data.data);
      console.log("hello there ", data);
      // setActiveConvoContext((convoContext) => {
      //   return {
      //     ...convoContext,
      //     messages: [...data.data, ...convoContext.messages],
      //   };
      // });
    });
  }, []);

  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  // let offsetLoadingLocal = false;
  console.log("inView: ", inView);
  // function* offsetGeneratorCreator(i: number) {
  //   while (true) {
  //     yield i;
  //     i += 10;
  //   }
  // }

  // let offsetGenerator: Generator<number, void, unknown> =
  //   offsetGeneratorCreator(10);

  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView();
  }, [activeConvo?.messages]);

  const messages = activeConvo?.messages?.map(
    ({ content, createdAt, sender }) => (
      <Message
        key={createdAt}
        content={content}
        createdAt={createdAt}
        username={sender.username}
      />
    )
  );
  return (
    <div className="flex-grow p-4 overflow-y-auto">
      {messages && <div ref={observeRef} />}
      {messages || null}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
