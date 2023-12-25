import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
import Message from "./Message";
import ConvosList from "./ConvosList";

export default function Chat() {
  const [user, setUser] = useContext(AuthContext);

  useEffect(() => {
    // console.log("user: ", user);
  }, [user]);

  return (
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
          {/* Individual messages */}
          <div className="m-2 p-2 bg-gray-200 rounded">
            <Message />
          </div>
          {/* More messages */}
          <div className="m-2 p-2 bg-gray-200 rounded">
            {/* <span className="font-semibold">Username 2:</span> Hi! */}
            <Message />
          </div>
          {/* Add more messages here */}
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
  );
}
