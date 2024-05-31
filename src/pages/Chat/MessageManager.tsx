import { useContext, useEffect, useRef, useState } from "react";
import useMessage from "../../hooks/useMessage";
import { AllConvoContext } from "@/context/AllConvoProvider";
import { MessageContext } from "@/context/MessageProvider";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "@/utils/animations";
// import { CircleX } from "lucide-react";
import VisuallyHidden from "@/components/VisuallyHidden";
import CloseXCircleButton from "@/components/ui/closeXCircleButton";

export default function MessageManager() {
  const {
    createdMessageContent,
    setCreatedMessageContent,
    send,
    edit,
    messageEdited,
    editMessageMode,
    setEditMessageMode,
    setMessageEdited,
  } = useContext(MessageContext)!;
  const [originalMessage, setOriginalMessage] = useState("");
  useEffect(() => {
    if (editMessageMode && messageEdited?.content) {
      setOriginalMessage(messageEdited.content);
    }
  }, [editMessageMode]);

  const textareaRef = useRef<HTMLTextAreaElement>(null);
  // TODO: #important the editing mode is still not fully working on mobile
  // the whole magic 250px thing should be revisited

  const adjustTextareaHeight = () => {
    if (!textareaRef.current) {
      return;
    }

    const textarea = textareaRef.current;
    // Minimal height before readjusting helps to avoid slow height change
    // on text deletion. Might be fixed later, because it seems hacky
    textareaRef.current.style.height = "1px";
    textarea.style.height = `${textarea.scrollHeight}px`;
    // TODO: i don't really like this magic 250px magic number thing
    if (parseInt(textarea.style.height, 10) > 250) {
      textarea.style.height = "250px";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [editMessageMode]);

  const handleSubmit = (e) => {
    if (!textareaRef.current) return;
    e.preventDefault();
    editMessageMode ? edit() : send();

    // TODO: #ask-artem
    // do people do that in actual code bases ?
    // setTimeout is needed only for editing mode

    setTimeout(() => {
      adjustTextareaHeight();
    }, 0);
  };

  const animationProps = {
    initial: animations["editMessage"]?.initial,
    animate: animations["editMessage"]?.animate,
    exit: animations["editMessage"]?.exit,
    transition: animations["editMessage"]?.transition,
    layout: true,
  };

  // TODO: this is not a form semantically speaking

  return (
    <form onSubmit={handleSubmit} className="bg-gray-100 p-4 flex">
      <div className="w-full">
        <AnimatePresence>
          {editMessageMode && (
            <motion.div
              {...animationProps}
              className="flex mb-2 content-start max-h-[20vh] overflow-y-scroll will-change-transform"
            >
              <div className="border-l-2 border-slate-500 p-2">
                <p>Editing</p>
                <p className="text-ellipsis">{originalMessage}</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div onSubmit={handleSubmit} className="flex wat">
          <textarea
            ref={textareaRef}
            value={
              editMessageMode ? messageEdited.content : createdMessageContent
            }
            onChange={(e) => {
              if (editMessageMode) {
                setMessageEdited((curr) => {
                  return { ...curr, content: e.target.value };
                });
              } else {
                setCreatedMessageContent(e.target.value);
              }
              adjustTextareaHeight();
            }}
            placeholder="Type a message..."
            // style={{ transition: "height 0.2s ease-out" }}
            className="textarea w-full p-2 rounded border border-gray-300 overflow-x-scroll resize-none h-10 transition ease-out duration-200"
            onKeyDown={(e) => {
              if (e.key === "Enter" && e.shiftKey) {
              } else if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            onInput={adjustTextareaHeight}
          />
        </div>
      </div>
      <div className="flex flex-col">
        {editMessageMode && (
          <CloseXCircleButton
            className="ml-auto h-fit"
            hiddenText="Cancel editing"
            onClick={() => setEditMessageMode(false)}
          />
        )}

        <button
          type="submit"
          className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 max-h-10 mt-auto"
        >
          {editMessageMode ? "Edit" : "Send"}
        </button>
      </div>
    </form>
  );
}
