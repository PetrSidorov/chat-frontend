import { ActiveConvoContext } from "../../context/ActiveConvoContext";
import { useContext, useEffect, useRef } from "react";
import Message from "./Message";
export default function ActiveConvo() {
  const [activeConvo, setActiveConvo] = useContext(ActiveConvoContext);
  const endOfMessagesRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  function* offsetGeneratorCreator(i: number) {
    while (true) {
      yield i;
      i += 10;
    }
  }

  const offsetGenerator: Generator<number, void, unknown> =
    offsetGeneratorCreator(10);

  useEffect(() => {
    const handleScroll = () => {
      if (
        scrollContainerRef.current &&
        scrollContainerRef.current.scrollTop < 200
      ) {
        setActiveConvo((prevConvo) => {
          if (prevConvo === null) {
            return null;
          }
          return {
            ...prevConvo,
            offset: offsetGenerator.next().value as number,
          };
        });
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
