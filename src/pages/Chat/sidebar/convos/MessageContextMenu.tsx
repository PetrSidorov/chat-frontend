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
  console.log("render");
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
