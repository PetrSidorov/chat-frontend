import { XCircle } from "lucide-react";
import { useContext } from "react";
import { AllConvoContext } from "../../../../context/AllConvoProvider";
import VisuallyHidden from "@/components/VisuallyHidden";
import { motion } from "framer-motion";
export default function MessageContextMenu({
  yours,
  handleRemoveMessage,
  id,
  top,
  left,
  handleDismiss,
}: {
  yours: boolean;
  handleRemoveMessage: Function;
  id: string;
  top: number;
  left: number;
  handleDismiss: Function;
}) {
  const [activeConvoId] = useContext(AllConvoContext).activeConvoId;
  return (
    <>
      {yours ? (
        <div className="fixed inset-0 z-1 " onClick={() => handleDismiss()}>
          <ul
            style={{
              position: "absolute",
              left: `${left}px`,
              top: `${top}px`,
              backgroundColor: "gray",
              borderRadius: "md",
              width: "max-content",
            }}
          >
            <li className="flex p-4">
              <button onClick={() => handleRemoveMessage(activeConvoId, id)}>
                <span className="mr-2">Delete message</span>
              </button>
              <motion.button
                onClick={() => handleDismiss()}
                whileHover={{
                  scale: 1.1,
                  rotate: [0, -5, 5, -5, 5, 0],
                  transition: { duration: 1 },
                }}
                whileTap={{ scale: 0.9 }}
              >
                <XCircle />
                <VisuallyHidden>Dismiss message deletion</VisuallyHidden>
              </motion.button>
            </li>
          </ul>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            backgroundColor: "gray",
            width: "max-content",
          }}
        >
          you can't
        </div>
      )}
    </>
  );
}
