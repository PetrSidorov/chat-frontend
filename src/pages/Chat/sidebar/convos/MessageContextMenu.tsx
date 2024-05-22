import useMessage from "@/hooks/useMessage";

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
  const { setMessageEdited, setEditMessageMode } = useMessage();
  return (
    <>
      {yours ? (
        <ul>
          <li className="flex flex-col mr-2">
            <button
              className="text-start"
              onClick={() => handleRemoveMessage(uuid)}
            >
              <span className="text-red-700">Delete message</span>
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
              <span>Edit message</span>
            </button>
          </li>
        </ul>
      ) : (
        <div>you can't</div>
      )}
    </>
  );
}
