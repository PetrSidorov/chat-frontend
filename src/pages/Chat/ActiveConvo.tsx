import { ActiveConvoContext } from "../../context/ActiveConvoContext";
import { useContext, useEffect, useRef } from "react";
import Message from "./Message";
export default function ActiveConvo() {
  const [activeConvo, setActiveConvo] =
    useContext(ActiveConvoContext).convoContext;
  const [offset, setOffset] = useContext(ActiveConvoContext).offsetContext;
  const [offsetLoading, setOffsetLoading] =
    useContext(ActiveConvoContext).offsetLoading;
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  let offsetLoadingLocal = false;

  function* offsetGeneratorCreator(i: number) {
    while (true) {
      yield i;
      i += 10;
    }
  }

  let offsetGenerator: Generator<number, void, unknown> =
    offsetGeneratorCreator(10);

  useEffect(() => {
    const handleScroll = () => {
      if (
        scrollContainerRef.current &&
        // !offsetLoading &&
        !offsetLoadingLocal &&
        scrollContainerRef.current.scrollTop < 200
      ) {
        console.log("hi");
        setOffset(2);
        offsetLoadingLocal = true;
        setOffsetLoading(true);
      }
    };

    const currentRef = scrollContainerRef.current;
    if (currentRef) {
      currentRef.addEventListener("scroll", handleScroll);
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener("scroll", handleScroll);
      }
    };
  }, []);

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
    <div ref={scrollContainerRef} className="flex-grow p-4 overflow-y-auto">
      {messages || null}
      <div ref={endOfMessagesRef} />
    </div>
  );
}
