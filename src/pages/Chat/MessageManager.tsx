import { useContext, useEffect, useRef } from "react";
import useMessage from "../../hooks/useMessage";
import { AllConvoContext } from "@/context/AllConvoProvider";
import { MessageContext } from "@/context/MessageProvider";
import { AnimatePresence, motion } from "framer-motion";
import { animations } from "@/utils/animations";
// import { CircleX } from "lucide-react";
import VisuallyHidden from "@/components/VisuallyHidden";
import CloseXCircleButton from "@/components/ui/CloseXCircleButton";

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

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    console.log("messageEdited ", messageEdited);
    console.log("editMessageMode ", editMessageMode);
  }, [messageEdited, editMessageMode]);

  const adjustTextareaHeight = () => {
    if (!textareaRef.current) return;
    const textarea = textareaRef.current;
    // Minimal height before readjusting helps to avoid slow height change
    // on text deletion. Might be fixed later, because it seems hacky
    textareaRef.current.style.height = "1px";
    textarea.style.height = `${textarea.scrollHeight}px`;
  };

  const handleSubmit = (e) => {
    if (!textareaRef.current) return;
    e.preventDefault();
    if (editMessageMode) {
      edit();
    } else {
      send();
    }
  };
  const animationProps = {
    initial: animations["editMessage"]?.initial,
    animate: animations["editMessage"]?.animate,
    exit: animations["editMessage"]?.exit,
    transition: animations["editMessage"]?.transition,
    layout: true,
  };

  return (
    <form onSubmit={handleSubmit} className="message-form p-4 bg-gray-100">
      <AnimatePresence>
        {editMessageMode && (
          <motion.div {...animationProps} className="flex">
            <div className="w-[2px] h-[1rem] bg-slate-500 mr-[0.4rem]" />
            <p>{messageEdited.content}</p>

            <CloseXCircleButton
              // className=""
              hiddenText="Cancel editing"
              onClick={() => setEditMessageMode(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <div className="flex">
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
          className="textarea w-full p-2 rounded border border-gray-300 overflow-hidden resize-none h-10 transition ease-out duration-200"
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
          className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 max-h-10"
        >
          {editMessageMode ? "Edit" : "Send"}
        </button>
      </div>
    </form>
  );
}
