import { MessageContext } from "@/context/MessageProvider";
import useMessage from "@/hooks/useMessage";
import { useContext } from "react";

export default function MessageContextMenu({
  yours,
  handleRemoveMessage,
  content,
  uuid,
}: {
  yours: boolean;
  handleRemoveMessage: Function;
  content: string;
  uuid: string;
}) {
  const { setMessageEdited, setEditMessageMode } = useContext(MessageContext)!;
  return (
    <>
      {yours ? (
        <ul>
          <li className="flex flex-col mr-2">
            <button
              className="text-start"
              onClick={() => handleRemoveMessage(uuid)}
            >
              <span id="test" className="text-red-700">
                Delete message
              </span>
            </button>
            <button
              className="text-start"
              onClick={() => {
                setMessageEdited({
                  messageId: uuid,
                  content,
                });
                setEditMessageMode(true);
              }}
            >
              <span id="test">Edit message</span>
            </button>
          </li>
        </ul>
      ) : (
        <div>you can't</div>
      )}
    </>
  );
}
