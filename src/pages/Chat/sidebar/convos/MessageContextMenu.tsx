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
          // className={`absolute left-[${left}px] top-[${top}px] bg-gray-500 rounded-md`}
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
            <li onClick={() => handleRemoveMessage(id)} className="flex p-4">
              <span className="mr-2">Delete message</span>
              <XCircle />
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
            borderRadius: "md",
            width: "max-content",
          }}
        >
          you can't
        </div>
      )}
    </>
  );
}
