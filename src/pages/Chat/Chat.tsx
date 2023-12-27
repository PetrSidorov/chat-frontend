import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ConvosList from "./ConvosList";
import ActiveConvo from "./ActiveConvo";
import ActiveConvoProvider from "../../context/ActiveConvoContext";
import { socket } from "../../utils/socket";

export default function Chat() {
  const [user, setUser] = useContext(AuthContext);
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
    socket.on("disconnect", onDisconnect);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    // console.log("user: ", user);
  }, [user]);

  return (
    <ActiveConvoProvider>
      <div className="h-screen flex">
        {/* User List Column */}
        <div className="flex flex-col w-1/3 bg-gray-800 text-white p-4">
          <h1 className="text-lg font-bold mb-3">Hi, {user?.username}</h1>
          <ConvosList />
        </div>
        {/* Chat Column */}
        <div className="flex flex-col w-2/3">
          {/* Messages Area */}
          <div className="flex-grow p-4 overflow-y-auto">
            <ActiveConvo />
          </div>

          {/* Message Input Area */}
          <div className="p-4 bg-gray-100 flex">
            <input
              type="text"
              className="w-full p-2 rounded border border-gray-300"
              placeholder="Type a message..."
            />
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold
            py-2 px-4 rounded focus:outline-none focus:shadow-outline ml-2"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </ActiveConvoProvider>
  );
}
