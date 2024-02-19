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
  showOnlyAvatars = false,
}: {
  content: string;
  createdAt: string;
  username: string;
  avatarUrl: string | null;
  showOnlyAvatars?: boolean;
}) {
  const date = createdAt ? new Date(createdAt).toDateString() : "";

  // TODO: ${alignment} ${classes} - gives undefined undefined - fix
  // TODO:   text-overflow: ellipsis;

  return (
    <li className="flex items-start m-2 p-4 bg-gray-200">
      <Avatar avatarUrl={avatarUrl} />
      {!showOnlyAvatars && (
        <div className="ml-2 w-full overflow-x-hidden">
          <div className="flex justify-between mb-3">
            <span>{username}</span> <span>{date}</span>
          </div>
          <p>{content}</p>
        </div>
      )}
    </li>
  );
}
