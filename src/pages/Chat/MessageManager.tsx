import { useEffect, useState, useContext } from "react";
import { TMessage } from "../../types";
import { ActiveConvoContext } from "../../context/ActiveConvoContext";
import { socket } from "../../utils/socket";
import { AuthContext } from "../../context/AuthContext";

// {
//     "id": "clq0pqkro0001glekpi3c4ylx",
//     "initiator": "peter1",
//     "joiner": "peter3",
//     "initiatorId": "clq0oftzf0001rcqrads0mxtp",
//     "joinerId": "clq0oh6oz0004rcqrvu8p8tzg",
//     "userId": "clq0oftzf0001rcqrads0mxtp"
// }
export default function MessageManager() {
  const [user, _] = useContext(AuthContext);
  const initialMesssage = {
    content: "",
    convoId: "",
    createdAt: "",
    sender: {
      username: user?.username || "user",
    },
  };

  const [activeConvoContext, setActiveConvoContext] =
    useContext(ActiveConvoContext).convoContext;
  const [message, setMessage] = useState<TMessage>(initialMesssage);

  useEffect(() => {
    console.log("active context in msg mng: ", activeConvoContext);
    console.log(message);
  }, [message]);

  useEffect(() => {
    if (message.createdAt) {
      const { convoId, ...clientSideMessage } = message;

      setActiveConvoContext((activeConvoContext) => {
        return {
          ...activeConvoContext,
          messages: [...activeConvoContext.messages, clientSideMessage],
        };
      });

      setMessage((msg) => {
        const { sender, ...restOfTheMessage } = msg;
        return restOfTheMessage;
      });
      console.log("msg", message);
      socket.emit("msg:send", message);
      setMessage(initialMesssage);
    }
  }, [message.createdAt]);

  function sendMessage() {
    setMessage((msg) => {
      return { ...msg, createdAt: new Date().toISOString() };
    });

    // const { convoId, ...clientSideMessage } = message;

    // setActiveConvoContet((activeConvoContext) => {
    //   return [...activeConvoContext.messages, clientSideMessage];
    // });

    // setMessage((msg) => {
    //   const { sender, ...restOfTheMessage } = msg;
    //   return restOfTheMessage;
    // });
    // console.log("msg", message);
    // socket.emit("msg:send", message);
  }

  console.log("activeConvoContext: ", activeConvoContext);
  function messageHandler(e) {
    // const receiverId =
    //   activeConvoContext.joinerId == activeConvoContext.userId
    //     ? activeConvoContext.senderId
    //     : activeConvoContext.joinerId;
    setMessage((prevMessage) => ({
      ...prevMessage,
      content: e.target.value,
      convoId: activeConvoContext.id,
      // receiverId,
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
