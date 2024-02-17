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
  // yours,
  // handleRemoveMessage,
  id,
}: {
  content: string;
  createdAt: string;
  username: string;
  alignment: string;
  classes: string;
  avatarUrl: string | null;
  // yours: boolean;
  // handleRemoveMessage: Function;
  id: string;
}) {
  const date = createdAt ? new Date(createdAt).toDateString() : "";

  // TODO: ${alignment} ${classes} - gives undefined undefined - fix
  return (
    <li
      className={`flex items-center m-2 p-2 bg-gray-200 rounded ${alignment} ${classes}`}
    >
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
