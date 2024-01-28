import { useState } from "react";
import { TSidebarTabs } from "../../../types";
import FriendsTab from "./FriendsTab";
import SettingsTab from "./SettingsTab";
import ConvosList from "./convos/ConvosList";
import { MessageSquare, Settings, User } from "lucide-react";
import SidebarFooterButton from "../../../components/SidebarFooterButton";

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
        <SidebarFooterButton
          onHandle={() => setActiveTab(TSidebarTabs.MESSAGES)}
          tabName={TSidebarTabs.MESSAGES}
          icon={MessageSquare}
        />
        <SidebarFooterButton
          onHandle={() => setActiveTab(TSidebarTabs.SETTINGS)}
          tabName={TSidebarTabs.SETTINGS}
          icon={Settings}
        />
        <SidebarFooterButton
          onHandle={() => setActiveTab(TSidebarTabs.FRIENDS)}
          tabName={TSidebarTabs.FRIENDS}
          icon={User}
        />
      </div>
    </>
  );
}
