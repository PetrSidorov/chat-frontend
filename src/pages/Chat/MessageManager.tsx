import { useEffect, useState, useContext } from "react";
import { MessageT } from "../../types";
import { ActiveConvoContext } from "../../context/ActiveConvoContext";
import { socket } from "../../utils/socket";

// {
//     "id": "clq0pqkro0001glekpi3c4ylx",
//     "initiator": "peter1",
//     "joiner": "peter3",
//     "initiatorId": "clq0oftzf0001rcqrads0mxtp",
//     "joinerId": "clq0oh6oz0004rcqrvu8p8tzg",
//     "currUserId": "clq0oftzf0001rcqrads0mxtp"
// }
export default function MessageManager() {
  const [activeConvoContext, _] = useContext(ActiveConvoContext);
  const [message, setMessage] = useState<MessageT>({
    content: "",
    senderId: "",
    receiverId: "",
    convoId: "",
  });
  useEffect(() => {
    console.log("active context in msg mng: ", activeConvoContext);
    console.log(message);
  }, [message]);

  function sendMessage() {
    socket.emit("msg:send", message);
  }
  function messageHandler(e) {
    const receiverId =
      activeConvoContext.joinerId == activeConvoContext.currUserid
        ? activeConvoContext.senderId
        : activeConvoContext.joinerId;
    setMessage((prevMessage) => ({
      ...prevMessage,
      content: e.target.value,
      convoId: activeConvoContext.id,
      senderId: activeConvoContext.currUserId,
      receiverId,
    }));
  }

  return (
    <div className="p-4 bg-gray-100 flex">
      <input
        type="text"
        value={message.content}
        onChange={messageHandler}
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
