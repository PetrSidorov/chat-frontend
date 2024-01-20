import { useState } from "react";
import { TSidebarTabs } from "../../types";
import FriendsTab from "./FriendsTab";
import SettingsTab from "./SettingsTab";
import ConvosList from "./ConvosList";
import { MessageSquare, Settings, User } from "lucide-react";

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<TSidebarTabs>(
    TSidebarTabs.MESSAGES
  );

  return (
    <>
      {activeTab === TSidebarTabs.FRIENDS && <FriendsTab />}
      {activeTab === TSidebarTabs.SETTINGS && <SettingsTab />}
      {activeTab === TSidebarTabs.MESSAGES && <ConvosList />}

      <div className="mt-auto flex justify-evenly items-center bg-gray-200 p-4 text-black">
        <button
          onClick={() => setActiveTab(TSidebarTabs.MESSAGES)}
          className="flex flex-col items-center justify-center hover:bg-gray-300 p-2 rounded text-inherit"
        >
          <MessageSquare className="h-6 w-6 text-inherit" />
          <span className="text-xs mt-1">Messages</span>
        </button>
        <button
          onClick={() => setActiveTab(TSidebarTabs.SETTINGS)}
          className="flex flex-col items-center justify-center hover:bg-gray-300 p-2 rounded text-inherit"
        >
          <Settings className="h-6 w-6 text-inherit" />
          <span className="text-xs mt-1">Settings</span>
        </button>
        <button
          onClick={() => setActiveTab(TSidebarTabs.FRIENDS)}
          className="flex flex-col items-center justify-center hover:bg-gray-300 p-2 rounded text-inherit"
        >
          <User className="h-6 w-6 text-inherit" />
          <span className="text-xs mt-1">Friends</span>
        </button>
      </div>
    </>
  );
}
