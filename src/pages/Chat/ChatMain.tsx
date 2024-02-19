import Split from "react-split";
import ActiveConvoProvider from "../../context/AllConvoContext";
import ActiveConvo from "./ActiveConvo";
import MessageManager from "./MessageManager";

import Sidebar from "./sidebar/Sidebar";

export default function ChatMain() {
  return (
    <ActiveConvoProvider>
      <Split className="h-screen flex" gutterSize={5} minSize={200}>
        {/* User List Column */}
        <div className="flex flex-col w-1/3 bg-gray-800 text-white p-4">
          <Sidebar />
        </div>
        {/* Chat Column */}
        <div className="flex flex-col w-2/3">
          {/* Messages Area */}
          <ActiveConvo />
          {/* Message Input Area */}
          <MessageManager />
        </div>
      </Split>
    </ActiveConvoProvider>
  );
}
