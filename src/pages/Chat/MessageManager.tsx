// id         String   @id @default(cuid())
// content    String
// createdAt  DateTime @default(now())
// senderId   String
// receiverId String
// convoId    String

import useMessage from "../../hooks/useMessage";
export default function MessageManager() {
  const { message, sendMessage, handleMessage } = useMessage();

  return (
    <form className="p-4 bg-gray-100 flex">
      <input
        type="text"
        value={message.content}
        onChange={(e) => handleMessage(e.target.value)}
        className="w-full p-2 rounded border border-gray-300"
        placeholder="Type a message..."
      />
      <button
        onClick={(e) => sendMessage(e)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold
    py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
      >
        Send
      </button>
    </form>
  );
}
