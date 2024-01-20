import { useState } from "react";
import { TSidebarTabs } from "../../types";
import FriendsTab from "./FriendsTab";
import SettingsTab from "./SettingsTab";
import ConvosList from "./ConvosList";

// Sidebar component
export default function Sidebar() {
  const [activeTab, setActiveTab] = useState<TSidebarTabs>(
    TSidebarTabs.MESSAGES
  );

  function handleTabSwitch(newActiveTab: TSidebarTabs) {
    setActiveTab(newActiveTab);
  }

  return (
    <>
      {activeTab === TSidebarTabs.FRIENDS && <FriendsTab />}
      {activeTab === TSidebarTabs.SETTINGS && <SettingsTab />}
      {activeTab === TSidebarTabs.MESSAGES && <ConvosList />}
      <SidebarFooter onTabSwitch={handleTabSwitch} />
    </>
  );
}

// SidebarFooter component (example implementation)
function SidebarFooter({ onTabSwitch }) {
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
    // <div>
    //   <button onClick={() => onTabSwitch(TSidebarTabs.FRIENDS)}>Friends</button>
    //   <button onClick={() => onTabSwitch(TSidebarTabs.SETTINGS)}>
    //     Settings
    //   </button>
    //   <button onClick={() => onTabSwitch(TSidebarTabs.MESSAGES)}>
    //     Messages
    //   </button>
    // </div>
  );
}
