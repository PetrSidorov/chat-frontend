import { MessageSquare, Search, Settings } from "lucide-react";
import { ReactNode } from "react";
import VisuallyHidden from "../../../components/VisuallyHidden";
import { Link } from "react-router-dom";

export default function Sidebar({ children }: { children: ReactNode }) {
  // TODO:CSS move this margin up
  return (
    <>
      {children}

      <ul className="mt-auto flex justify-around">
        <li>
          <Link
            to="/messages"
            className="flex flex-col items-center justify-center hover:bg-gray-300 p-2 rounded text-inherit"
          >
            <MessageSquare />
            <VisuallyHidden>
              <span>Messages</span>
            </VisuallyHidden>
          </Link>
        </li>
        <li>
          <Link
            to="/search"
            className="flex flex-col items-center justify-center hover:bg-gray-300 p-2 rounded text-inherit"
          >
            <Search />
            <VisuallyHidden>
              <span>Contacts</span>
            </VisuallyHidden>
          </Link>
        </li>
        <li>
          <Link
            to="/settings"
            className="flex flex-col items-center justify-center hover:bg-gray-300 p-2 rounded text-inherit"
          >
            <Settings />
            <VisuallyHidden>
              <span>Settings</span>
            </VisuallyHidden>
          </Link>
        </li>
      </ul>
    </>
  );
}
