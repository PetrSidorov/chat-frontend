import { XCircle } from "lucide-react";
export default function MessageContextMenu({
  yours,
  handleRemoveMessage,
  id,
  top,
  left,
}: {
  yours: boolean;
  handleRemoveMessage: Function;
  id: string;
  top: number;
  left: number;
}) {
  return (
    <>
      {yours ? (
        <div
          style={{
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            backgroundColor: "gray",
            borderRadius: "md",
            width: "max-content",
          }}
        >
          <ul>
            <li>
              <button
                className="flex p-4"
                onClick={() => handleRemoveMessage(id)}
              >
                <span className="mr-2">Delete message</span>
                <XCircle />
              </button>
            </li>
          </ul>
        </div>
      ) : (
        <div
          style={{
            position: "absolute",
            left: `${left}px`,
            top: `${top}px`,
            backgroundColor: "gray",
            width: "max-content",
          }}
        >
          you can't
        </div>
      )}
    </>
  );
}
