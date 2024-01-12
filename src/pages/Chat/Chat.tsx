import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import ConvosList from "./ConvosList";
import ActiveConvo from "./ActiveConvo";
import ActiveConvoProvider from "../../context/ActiveConvoContext";
import MessageManager from "./MessageManager";
import ConvoProvider from "../../context/ConvoContext";

export default function Chat() {
  const [user, _] = useContext(AuthContext);

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
          <MessageManager />
        </div>
      </div>
    </ActiveConvoProvider>
  );
}
