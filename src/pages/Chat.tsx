import { useEffect, useState } from "react";
import fetchDB from "../utils/fetchDB";
import { socket } from "../utils/socket";

export default function Chat() {
  const [convos, setConvos] = useState([]);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [dialog, setDialog] = useState([]);
  const [activeconvo, setActiveconvo] = useState("");
  const [participant, setParticipant] = useState("");
  const [participantId, setParticipantId] = useState("");
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      console.log("socket connect");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("socket disconnect");
      setIsConnected(false);
    }

    socket.on("connect_error", (error) => {
      console.log("Connection Error:", error);
    });

    socket.on("connect", onConnect);
    // socket.on("disconnect", onDisconnect);

    return () => {
      //   socket.off("connect", onConnect);
      //   socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    fetchDB({ method: "GET", url: "http://localhost:3007/api/user" }).then(
      (data) => setUsers(data.users)
    );

    fetchDB({ method: "GET", url: "http://localhost:3007/api/convo" }).then(
      (data) => {
        // console.log(data.data.filter(convo => convo.initiatorId != ));
        setConvos(
          data.data.initiatedConvos
            .map((convo) => convo.id)
            .concat(data.data.joinedConvos.map((convo) => convo.id))
        );
      }
    );
  }, []);

  //   useEffect(() => {
  //     convos.map((convoId) =>
  //       fetchDB({
  //         method: "GET",
  //         url: `http://localhost:3007/api/messages/${convoId}`,
  //       }).then((data) => console.log(data.data))
  //     );
  //   }, [convos]);

  function sendMessage(e) {
    e.preventDefault();
    // test
    console.log("socket: ", socket);
    socket.emit("message", {
      data: "data-test",
      //   content: message,
      //   receiverId: participantId,
      //   convoId: activeconvo,
      //   socketID: socket.id,
    });

    // test
    // good
    // fetchDB({
    //   method: "POST",
    //   url: `http://localhost:3007/api/message`,
    //   body: {
    //     content: message,
    //     receiverId: participantId,
    //     convoId: activeconvo,
    //   },
    // });
    // good
  }

  function handleMessageChange(e) {
    setMessage(e.target.value);
  }

  function loadChat(companionId, username) {
    setParticipant(username);
    setParticipantId(companionId);
    fetchDB({
      method: "GET",
      url: `http://localhost:3007/api/messages-with-user/${companionId}`,
    }).then((data) => {
      //   console.log(
      //     data.data.messages.map((message) => {
      //       const user = users.find((user) => user.id === message.senderId);
      //       return { ...message, username: user.username };
      //     })
      //   );
      setDialog(
        data.data.messages.map((message) => {
          const user = users.find((user) => user.id === message.senderId);
          return { ...message, username: user.username };
        })
      );
      setActiveconvo(data.data.id);
    });
    // }).then((data) => console.log(data.data));
  }

  useEffect(() => {
    console.log("dialog: ", dialog);
  }, [dialog]);

  function startConvo(joinerId) {
    fetchDB({
      method: "POST",
      url: "http://localhost:3007/api/convo",
      body: { joinerId },
    }).then((data) => console.log(data));
  }
  return (
    <div className="flex w-full h-screen">
      <div className="w-1/3 h-full bg-red-100">
        <ul>
          {users?.map((user) => (
            <div
              key={user.id}
              className="p-2 flex flex-col border-4 border-white-400"
            >
              {user.username}
              <button
                className="bg-blue-500 hover:bg-blue-700
                text-white font-bold py-2 px-4 rounded"
                onClick={() => startConvo(user.id)}
              >
                Start convo
              </button>
              <button onClick={() => loadChat(user.id, user.username)}>
                Chat with
              </button>
            </div>
          ))}
        </ul>
      </div>
      <div className="w-2/3 h-full bg-yellow-100">
        <ul>
          {dialog.map((message) => (
            <li key={message.id} className="p-2 border-4 border-white">
              {/* get partidipant here ? */}
              {message.username} says: "{message.content}"
            </li>
          ))}
        </ul>
        <form className="flex flex-col w-96 m-auto" onSubmit={sendMessage}>
          <label htmlFor="send">Send message</label>
          <input
            onChange={handleMessageChange}
            value={message}
            name="message"
            id="send"
            type="text"
          />
          <button type="submit">Send</button>
        </form>
      </div>
    </div>
  );
}
