import { useState } from "react";
import CloseXCircleButton from "./CloseXCircleButton";

export interface PopupProps {
  children: JSX.Element;
  popup: JSX.Element;
}
export const PopupTrigger: React.FC<PopupProps> = ({ children, popup }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [coordinates, setCoordinates] = useState({ left: 0, top: 0 });
  const handleShowPopup = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const left = e.clientX;
    const top = e.clientY;
    console.log({ left, top });
    setCoordinates({ left, top });
    setShowPopup(true);
  };

  const handleDismiss = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    setShowPopup(false);
  };

  return (
    <>
      <div
        className={showPopup ? "fixed inset-0 z-1 " : ""}
        onClick={(e) => {
          showPopup ? handleDismiss(e) : "";
        }}
        onContextMenu={(e) => {
          e.preventDefault();
          showPopup ? handleDismiss(e) : "";
        }}
      />
      {/* TODO: fix the error below */}
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
            <CloseXCircleButton
              hiddenText="Dismiss pop up"
              onClick={() => {
                showPopup ? setShowPopup(false) : "";
              }}
            />
          </div>
        ) : null}
      </div>
    </>
  );
};
