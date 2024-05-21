export default function MessageContextMenu({
  yours,
  handleRemoveMessage,
  handleEditMessage,
  uuid,
}: {
  yours: boolean;
  handleRemoveMessage: Function;
  handleEditMessage: () => {};
  uuid: string;
}) {
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
            <button className="text-start" onClick={() => handleEditMessage()}>
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
