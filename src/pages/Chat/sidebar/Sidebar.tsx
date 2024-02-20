import { useState } from "react";
import { TSidebarTabs } from "../../../types";
import FriendsTab from "./FriendsTab";
import SettingsTab from "./SettingsTab";
import ConvosList from "./convos/ConvosList";
import { MessageSquare, Settings, User } from "lucide-react";
import SidebarFooterButton from "../../../components/SidebarFooterButton";
import { useNavigate } from "react-router-dom";
import useTabs from "../../../hooks/useTabs";
import { AnimatePresence, motion } from "framer-motion";

export default function Sidebar() {
  const [activeTab, handleActiveTab] = useTabs<TSidebarTabs>(
    TSidebarTabs.MESSAGES
  );

  return (
    <>
      {/* {activeTab === TSidebarTabs.FRIENDS && <FriendsTab />}
      {activeTab === TSidebarTabs.SETTINGS && <SettingsTab />}
      {activeTab === TSidebarTabs.MESSAGES && <ConvosList />} */}
      <AnimatePresence mode="wait">
        {activeTab === TSidebarTabs.FRIENDS && (
          <motion.div
            key="friends"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <FriendsTab />
          </motion.div>
        )}
        {activeTab === TSidebarTabs.SETTINGS && (
          <motion.div
            key="settings"
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <SettingsTab />
          </motion.div>
        )}
        {activeTab === TSidebarTabs.MESSAGES && <ConvosList />}
      </AnimatePresence>

      <div className="mt-auto flex justify-evenly items-center bg-gray-200 p-4 text-black">
        <SidebarFooterButton
          onHandle={() => handleActiveTab(TSidebarTabs.MESSAGES)}
          tabName={TSidebarTabs.MESSAGES}
          icon={MessageSquare}
        />
        <SidebarFooterButton
          onHandle={() => handleActiveTab(TSidebarTabs.SETTINGS)}
          tabName={TSidebarTabs.SETTINGS}
          icon={Settings}
        />
        <SidebarFooterButton
          onHandle={() => handleActiveTab(TSidebarTabs.FRIENDS)}
          tabName={TSidebarTabs.FRIENDS}
          icon={User}
        />
      </div>
    </>
  );
}
