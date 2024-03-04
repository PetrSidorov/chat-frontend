import React, { useRef } from "react";
import useMessage from "../../hooks/useMessage";

export default function MessageManager() {
  const { message, setMessage, send } = useMessage();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustTextareaHeight = () => {
    if (!textareaRef.current) return;

    const textarea = textareaRef.current;
    textarea.style.height = "auto";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = (e) => {
    if (!textareaRef.current) return;
    e.preventDefault();
    send();

    textareaRef.current.style.height = "auto";
  };

  return (
    <form onSubmit={handleSubmit} className="message-form p-4 bg-gray-100 flex">
      <textarea
        ref={textareaRef}
        value={message}
        onChange={(e) => {
          setMessage(e.target.value);
          adjustTextareaHeight();
        }}
        placeholder="Type a message..."
        className="textarea w-full p-2 rounded border border-gray-300 overflow-hidden resize-none"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey) {
          } else if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
          }
        }}
        onInput={adjustTextareaHeight}
      />
      <button
        type="submit"
        className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
      >
        Send
      </button>
    </form>
  );
}
