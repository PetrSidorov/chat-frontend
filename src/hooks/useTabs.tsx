import { useState } from "react";
// import { TSidebarTabs } from "../types";
import { useNavigate } from "react-router-dom";

export default function useTabs<T extends string>(initialTab: T) {
  const [activeTab, setActiveTab] = useState<T>(initialTab);
  let navigate = useNavigate();

  function handleActiveTab(tabToGo: T) {
    if (activeTab === tabToGo) return;
    setActiveTab(tabToGo);
    navigate("/" + tabToGo.toLowerCase());
  }

  return [activeTab, handleActiveTab];
}
