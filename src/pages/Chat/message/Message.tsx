import { MouseEventHandler, SyntheticEvent, useEffect, useState } from "react";
import { generateFetchAvatar } from "../../../utils/fetchAvatar";
import Avatar from "./Avatar";
import MessageContextMenu from "../sidebar/convos/MessageContextMenu";
import HandleClickOutside from "../../../hooks/useClickOutside";
// import { ActiveConvoContext } from "../../context/ActiveConvoContext";
// import { useContext, useEffect } from "react";

export default function Message({
  content,
  createdAt,
  username,
  alignment,
  classes,
  avatarUrl,
  yours,
  handleRemoveMessage,
  id,
}: {
  content: string;
  createdAt: string;
  username: string;
  alignment: string;
  classes: string;
  avatarUrl: string | null;
  yours: boolean;
  handleRemoveMessage: Function;
  id: string;
}) {
  const date = createdAt ? new Date(createdAt).toDateString() : "";
  const [popupState, setPopupState] = useState({
    show: false,
    top: 0,
    left: 0,
  });
  function togglePopup(e: React.MouseEvent<HTMLElement>, forceShow?: boolean) {
    e.preventDefault();
    // const target = e.target as HTMLElement;
    const rect = e.currentTarget.getBoundingClientRect();
    // console.log("e.clientX ", e.clientX);
    // console.log("rect.left ", rect.left);
    const left = e.clientX - rect.left;
    const top = e.clientY - rect.top;
    // console.log("(left) , (top) ", left, top);
    // console.log("-------");
    // const x = e.clientX;
    // const y = e.clientY;
    setPopupState({
      show: forceShow || !popupState.show,
      top,
      left,
    });
  }
  // TODO: ${alignment} ${classes} - gives undefined undefined - fix
  return (
    <li
      className={`relative flex items-center m-2 p-2 bg-gray-200 rounded ${alignment} ${classes}`}
      onContextMenu={(e) => togglePopup(e)}
      onClick={(e) => togglePopup(e, false)}
    >
      {popupState.show && (
        <HandleClickOutside
          callback={() =>
            setPopupState((curr) => {
              return { ...curr, show: false };
            })
          }
        >
          <MessageContextMenu
            yours={yours}
            handleRemoveMessage={handleRemoveMessage}
            id={id}
            top={popupState.top}
            left={popupState.left}
          />
        </HandleClickOutside>
      )}
      <Avatar avatarUrl={avatarUrl} />
      <div className="ml-2">
        <div className="flex justify-between mb-3">
          <span>{username}</span> <span>{date}</span>
        </div>
        <div>{content}</div>
      </div>
    </li>
  );
}
