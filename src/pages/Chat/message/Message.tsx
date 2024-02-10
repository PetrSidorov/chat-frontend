import Avatar from "./Avatar";
// import { ActiveConvoContext } from "../../context/ActiveConvoContext";
// import { useContext, useEffect } from "react";

export default function Message({
  content,
  createdAt,
  username,
  alignment,
  classes,
}: {
  content: string;
  createdAt: string;
  username: string;
  alignment: string;
  classes: string;
}) {
  const date = createdAt ? new Date(createdAt).toDateString() : "";

  return (
    <li
      className={`flex items-center m-2 p-2 bg-gray-200 rounded  ${alignment} ${classes}`}
    >
      <Avatar />
      <div className="ml-2">
        <div className="flex justify-between mb-3">
          <span>{username}</span> <span>{date}</span>
        </div>
        <div>{content}</div>
      </div>
    </li>
  );
}
