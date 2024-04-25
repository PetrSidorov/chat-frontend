import { useContext, useEffect, useState } from "react";
import { AllConvoContext } from "../../context/AllConvoContext";
import useSockets from "../../hooks/useSockets";
import { TMessage } from "../../types";

// {
//     "id": "clq0pqkro0001glekpi3c4ylx",
//     "initiator": "peter1",
//     "joiner": "peter3",
//     "initiatorId": "clq0oftzf0001rcqrads0mxtp",
//     "joinerId": "clq0oh6oz0004rcqrvu8p8tzg",
//     "userId": "clq0oftzf0001rcqrads0mxtp"
// }
export default function MessageManager() {
  const { convos, addOffsetMessagesToConvo } =
    useContext(AllConvoContext).convoContext;
  const [activeConvoId, handleActiveConvoId] =
    useContext(AllConvoContext).activeConvoId;
  // const { loading, data: datas, error, setFetchData } = useFetchDB<any>();

  // const [user, _] = useContext(AuthContext);

  const initialMesssage = {
    content: "",
    convoId: activeConvoId,
    createdAt: "",
    sender: {
      username: user?.username,
    },
  };

  const [message, setMessage] = useState<TMessage>(initialMesssage);
  const { socketLoading, data, emit } = useSockets({
    emitFlag: "msg:create",
    onFlag: "msg:return",
    initialState: {},
  });

  // useEffect(() => {
  // if (message.createdAt) {
  //   const { convoId, ...clientSideMessage } = message;

  // setActiveConvoContext((activeConvoContext) => {
  //   return {
  //     ...activeConvoContext,
  //     messages: [...activeConvoContext.messages, clientSideMessage],
  //   };
  // });

  // setMessage((msg) => {
  //   const { sender, ...restOfTheMessage } = msg;
  //   return restOfTheMessage;
  // });
  // socket.emit("msg:send", message);
  // setMessage(initialMesssage);
  // }
  // }, [message.createdAt]);

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
    // emit(message);
  }

  useEffect(() => {
    // addOffsetMessagesToConvo({ id: data.convoId, newMessages: data.msg });
    console.log("data.convoId ", data.convoId);
    console.log("data.msg ", data.msg);
    console.log("user?.username); ", user?.username);
    console.log("convos?.[activeConvoId] ", convos?.[activeConvoId]);
  }, [data]);

  function messageHandler(e) {
    // const receiverId =
    //   activeConvoContext.joinerId == activeConvoContext.userId
    //     ? activeConvoContext.senderId
    //     : activeConvoContext.joinerId;
    setMessage((prevMessage) => ({
      ...prevMessage,
      content: e.target.value,
      convoId: activeConvoId,
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
