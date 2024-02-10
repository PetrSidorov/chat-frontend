// import { TargetIcon } from "lucide-react";
import { TSidebarTabs } from "../types";
import VisuallyHidden from "./VisuallyHidden";

export default function SidebarFooterButton({
  onHandle,
  icon: Icon,
  tabName,
}: {
  onHandle: Function;
  icon: React.ElementType;
  tabName: TSidebarTabs;
}) {
  return (
    <button
      onClick={() => onHandle()}
      className="flex flex-col items-center justify-center hover:bg-gray-300 p-2 rounded text-inherit"
    >
      <Icon className="h-6 w-6 text-inherit" />
      <VisuallyHidden>
        <span>{tabName}</span>
      </VisuallyHidden>
    </button>
  );
}
