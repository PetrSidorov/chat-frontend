import { useContext } from "react";
import { TCSSclampLines, TMessage, TUser } from "../../../../types";
import Message from "../../message/Message";
import IsOnline from "./IsOnline";
import { ResizeContext } from "../../../../context/ResizeProvider";

const style: TCSSclampLines = {
  display: "-webkit-box",
  WebkitBoxOrient: "vertical",
  WebkitLineClamp: 2,
  overflow: "hidden",
};

export default function ConvoPreview({
  messages,
  online,
  participants,
}: {
  messages: TMessage[];
  online: boolean;
  participants: TUser[];
}) {
  // console.log("messages ", messages);
  // console.log("online ", online);
  // console.log("participants ", participants);
  const notEmptyConvo = messages && messages.length > 0;
  const { showOnlyAvatars } = useContext(ResizeContext);

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
  let content = "";

  if (notEmptyConvo) {
    ({ content, createdAt } = messages[messages.length - 1]);

    if (content.length > 30) {
      trimmedContent = content.slice(0, 100) + "...";
    } else {
      trimmedContent = content;
    }
  }

  return (
    <div className="relative">
      {online && (
        <>
          <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute top-2 right-4"></div>
        </>
      )}
      <div className="absolute top-2 right-4">
        <IsOnline online={online} />
      </div>

      <Message
        key={notEmptyConvo ? createdAt : ""}
        content={
          notEmptyConvo
            ? trimmedContent
            : "This convo is empty, start messaging now =)"
        }
        createdAt={notEmptyConvo ? createdAt : ""}
        username={userNameToShow}
        avatarUrl={avatarUrl}
        showOnlyAvatars={showOnlyAvatars}
        style={style}
      />
    </div>
  );
}
