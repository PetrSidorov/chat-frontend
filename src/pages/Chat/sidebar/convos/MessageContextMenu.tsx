export default function MessageContextMenu({
  yours,
  handleRemoveMessage,
  uuid,
}: {
  yours: boolean;
  handleRemoveMessage: Function;
  uuid: string;
}) {
  return (
    <>
      {yours ? (
        <ul>
          <li>
            <button onClick={() => handleRemoveMessage(uuid)}>
              <span className="mr-2">Delete message</span>
            </button>
          </li>
        </ul>
      ) : (
        <div>you can't</div>
      )}
    </>
  );
}
