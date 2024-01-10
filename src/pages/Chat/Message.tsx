import Avatar from "./Avatar";
import { ActiveConvoContext } from "../../context/ActiveConvoContext";
import { useContext, useEffect } from "react";

export default function Message({
  content,
  createdAt,
  username,
  convoId,
  initiator,
  joiner,
  initiatorId,
  joinerId,
  currUserId: senderId,
}: {
  content: string;
  createdAt: string;
  username: string;
  convoId?: string;
  initiator?: string;
  joiner?: string;
  initiatorId: string;
  joinerId: string;
  currUserId: string;
}) {
  const date = new Date(createdAt).toDateString();
  const [activeConvo, setActiveConvo] = useContext(ActiveConvoContext);

  useEffect(() => {
    // console.log("activeConvo?", activeConvo);
    console.log("hey: ", senderId);
  }, [activeConvo]);

  return (
    <li
      onClick={() =>
        setActiveConvo({
          id: convoId,
          initiator,
          joiner,
          initiatorId,
          joinerId,
          senderId,
        })
      }
      className="flex items-center m-2 p-2 bg-gray-200 rounded"
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
