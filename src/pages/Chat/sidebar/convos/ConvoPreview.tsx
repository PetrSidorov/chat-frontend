import { useContext } from "react";
import { ResizeContext } from "../../../../context/ResizeProvider";
import { TCSSclampLines, TMessage, TUser } from "../../../../types";
import Message from "../../message/Message";
import ConvoContextMenu from "./ConvoContextMenu";
import IsOnline from "./IsOnline";

const style: TCSSclampLines = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
};

export default function ConvoPreview({
  message,
  // online,
  participants,
  id,
}: {
  message: TMessage;
  // online: boolean;
  id: string;
  participants: TUser[];
}) {
  // console.log("messages ", messages);
  // console.log("online ", online);
  // console.log("participants ", participants);
  // const notEmptyConvo = messages && messages.length > 0;
  const { showOnlyAvatars } = useContext(ResizeContext);
  console.log("participants ", participants);
  // const group =
  const userNameToShow =
    Object.keys(participants)?.length > 1
      ? Object.values(participants)
          .map(({ username }) => username)
          .join(", ")
      : Object.values(participants)[0].username;

  const avatarUrl =
    Object.keys(participants)?.length > 1
      ? ""
      : Object.values(participants)[0].avatarUrl;

  let trimmedContent = "";
  let createdAt = "";
  // let content = "";

  if (message) {
    const { content, createdAt } = message;

    if (content.length > 30) {
      trimmedContent = content.slice(0, 100) + "...";
    } else {
      trimmedContent = content;
    }
  }

  return (
    <div>
      <div className="relative">
        <IsOnline className="absolute top-2 right-4" online={true} />
      </div>
      {/* TODO: what's hapenning with keys down there? */}
      <Message
        key={message ? createdAt : ""}
        content={
          message
            ? trimmedContent
            : "This convo is empty, start messaging now =)"
        }
        popup={<ConvoContextMenu id={id} />}
        createdAt={message ? createdAt : ""}
        username={userNameToShow}
        avatarUrl={avatarUrl}
        showOnlyAvatars={showOnlyAvatars}
        style={style}
      />
    </div>
  );
}
