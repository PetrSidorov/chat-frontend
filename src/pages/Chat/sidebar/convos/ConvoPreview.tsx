import { useContext } from "react";
import { TCSSclampLines, TMessage, TUser } from "../../../../types";
import Message from "../../message/Message";
import IsOnline from "./IsOnline";
import { ResizeContext } from "../../../../context/ResizeProvider";

export default function ConvoPreview({
  messages,
  online,
  receiver,
}: {
  messages: TMessage[];
  online: boolean;
  receiver: TUser;
}) {
  const notEmptyConvo = messages && messages.length > 0;
  const { showOnlyAvatars } = useContext(ResizeContext);
  const style: TCSSclampLines = {
    display: "-webkit-box",
    WebkitBoxOrient: "vertical",
    WebkitLineClamp: 2,
    overflow: "hidden",
  };

  if (notEmptyConvo) {
    let { content, createdAt, sender } = messages[messages.length - 1];

    let trimmedContent;
    if (content.length > 30) {
      trimmedContent = content.slice(0, 100) + "...";
    } else {
      trimmedContent = content;
    }

    return (
      <div className="relative">
        {online && (
          <>
            <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute top-2 right-4"></div>
            {/* <div>Hello everynan</div> */}
          </>
        )}
        <IsOnline online={online} />
        <Message
          key={createdAt}
          content={trimmedContent}
          createdAt={createdAt}
          username={receiver.username}
          avatarUrl={receiver.avatarUrl}
          showOnlyAvatars={showOnlyAvatars}
          style={style}
        />
      </div>
    );
  } else {
    return (
      <Message
        createdAt={""}
        content={"This convo is empty, start messaging now =)"}
        username={receiver.username}
        avatarUrl={receiver.avatarUrl}
        showOnlyAvatars={showOnlyAvatars}
        style={style}
      />
    );
  }
}
