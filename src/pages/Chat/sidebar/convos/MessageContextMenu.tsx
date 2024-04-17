export default function MessageContextMenu({
  yours,
  handleRemoveMessage,
  id,
}: {
  yours: boolean;
  handleRemoveMessage: Function;
  id: string;
}) {
  return (
    <>
      {yours ? (
        <ul>
          <li>
            <button onClick={() => handleRemoveMessage(id)}>
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
