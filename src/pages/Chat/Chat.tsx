import { useContext, useEffect } from "react";
import { AuthContext } from "../../context/AuthContext";
export default function Chat() {
  const [user, setUser] = useContext(AuthContext);

  useEffect(() => {
    console.log("user: ", user);
  }, [user]);

  return (
    <div className="flex flex-col h-screen">
      {/* Chat Header */}
      <div className="bg-gray-800 text-white p-4">
        <h1 className="text-lg font-bold">Hi, {user?.username}</h1>
      </div>

      {/* Messages Area */}
      <div className="flex-1 p-4 overflow-y-auto">
        {/* Individual messages */}
        <div className="m-2 p-2 bg-gray-200 rounded">
          <span className="font-semibold">Username:</span> Hello there!
        </div>
        {/* More messages */}
      </div>

      {/* Message Input Area */}
      <div className="p-4 bg-gray-100">
        <input
          type="text"
          className="w-full p-2 rounded border border-gray-300"
          placeholder="Type a message..."
        />
      </div>
    </div>
  );
}
