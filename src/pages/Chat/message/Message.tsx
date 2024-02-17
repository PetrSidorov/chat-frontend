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
  avatarUrl,
}: {
  content: string;
  createdAt: string;
  username: string;
  avatarUrl: string | null;
}) {
  const date = createdAt ? new Date(createdAt).toDateString() : "";

  // TODO: ${alignment} ${classes} - gives undefined undefined - fix
  return (
    <li className="flex items-center m-2 p-4 bg-gray-200">
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
