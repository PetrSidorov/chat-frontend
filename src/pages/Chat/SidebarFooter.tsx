import { MessageSquare, Settings, User } from "lucide-react";

export default function SidebarFooter({ onHandle }: { onHandle: Function }) {
  return (
    <div className="mt-auto flex justify-evenly items-center bg-gray-200 p-4 text-black">
      <button
        onClick={() => onHandle("MESSAGES")}
        className="flex flex-col items-center justify-center hover:bg-gray-300 p-2 rounded text-inherit"
      >
        <MessageSquare className="h-6 w-6 text-inherit" />
        <span className="text-xs mt-1">Messages</span>
      </button>
      <button
        onClick={() => onHandle("SETTINGS")}
        className="flex flex-col items-center justify-center hover:bg-gray-300 p-2 rounded text-inherit"
      >
        <Settings className="h-6 w-6 text-inherit" />
        <span className="text-xs mt-1">Settings</span>
      </button>
      <button
        onClick={() => onHandle("FRIENDS")}
        className="flex flex-col items-center justify-center hover:bg-gray-300 p-2 rounded text-inherit"
      >
        <User className="h-6 w-6 text-inherit" />
        <span className="text-xs mt-1">Friends</span>
      </button>
    </div>
  );
}
