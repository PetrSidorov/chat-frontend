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

  // useEffect(() => {
  //   console.log("messageEdited ", messageEdited);
  //   console.log("editMessageMode ", editMessageMode);
  // }, [messageEdited, editMessageMode]);

  const adjustTextareaHeight = () => {
    console.log('let"s goooO!!!');
    if (!textareaRef.current || textareaRef.current.style.height == "300px")
      return;
    const textarea = textareaRef.current;
    // Minimal height before readjusting helps to avoid slow height change
    // on text deletion. Might be fixed later, because it seems hacky
    textareaRef.current.style.height = "1px";
    textarea.style.height = `${textarea.scrollHeight}px`;
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
    // settimeout is needed only for editing mode
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

  return (
    <div className="bg-gray-100 p-4">
      <AnimatePresence>
        {editMessageMode && (
          <motion.div {...animationProps} className="flex mb-2 content-start">
            <div className="border-l-2 border-slate-500 p-2">
              <p>Editing</p>
              <p className="whitespace-pre-wrap overflow-y-scroll">
                {messageEdited.content}
              </p>
            </div>

            {/* TODO: #ask-artem or figure out why align-self-end doesn't work on
            the xcircle button instead of ml-auto */}
            <CloseXCircleButton
              className="ml-auto h-fit"
              hiddenText="Cancel editing"
              onClick={() => setEditMessageMode(false)}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <form onSubmit={handleSubmit} className="flex">
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
        <button
          type="submit"
          className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2 max-h-10"
        >
          {editMessageMode ? "Edit" : "Send"}
        </button>
      </form>
    </div>
  );
}
