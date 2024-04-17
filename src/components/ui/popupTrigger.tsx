import { motion } from "framer-motion";
import { XCircle } from "lucide-react";
import { useState } from "react";
import VisuallyHidden from "../VisuallyHidden";

export interface PopupProps {
  children: JSX.Element;
  popup: JSX.Element;
}
export const PopupTrigger: React.FC<PopupProps> = ({ children, popup }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [coordinates, setCoordinates] = useState({ left: 0, top: 0 });
  const handleShowPopup = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    const left = e.clientX;
    const top = e.clientY;
    setCoordinates({ left, top });
    setShowPopup(true);
  };
  return (
    <>
      <div
        className={showPopup ? "fixed inset-0 z-1 " : ""}
        onClick={() => {
          showPopup ? setShowPopup(false) : "";
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          showPopup ? setShowPopup(false) : "";
        }}
      />
      <div onContextMenu={handleShowPopup}>
        {children}
        {showPopup ? (
          <div
            style={{
              position: "absolute",
              left: `${coordinates.left}px`,
              top: `${coordinates.top}px`,
              width: "max-content",
            }}
            className="flex bg-gray-500 rounded-md p-4"
          >
            {popup}
            <motion.button
              onClick={() => {
                showPopup ? setShowPopup(false) : "";
              }}
              whileHover={{
                scale: 1.1,
                rotate: [0, -5, 5, -5, 5, 0],
                transition: { duration: 1 },
              }}
              whileTap={{ scale: 0.9 }}
            >
              <XCircle />
              <VisuallyHidden>Dismiss pop up</VisuallyHidden>
            </motion.button>
          </div>
        ) : null}
      </div>
    </>
  );
};
