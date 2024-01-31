// {
//     "id": "clq0pqkro0001glekpi3c4ylx",
//     "initiator": "peter1",
//     "joiner": "peter3",
//     "initiatorId": "clq0oftzf0001rcqrads0mxtp",
//     "joinerId": "clq0oh6oz0004rcqrvu8p8tzg",
//     "userId": "clq0oftzf0001rcqrads0mxtp"

import useMessage from "../../hooks/useMessage";

// }
export default function MessageManager() {
  const { message, sendMessage, handleMessage } = useMessage();

  return (
    <div className="p-4 bg-gray-100 flex">
      <input
        type="text"
        value={message.content}
        onChange={(e) => handleMessage(e.target.value)}
        className="w-full p-2 rounded border border-gray-300"
        placeholder="Type a message..."
      />
      <button
        onClick={sendMessage}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold
    py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
      >
        Send
      </button>
    </div>
  );
}
