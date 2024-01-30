import { useEffect, useState, useCallback } from "react";
import { socket } from "../../../utils/socket";
import { debounce } from "lodash";
import { Loader } from "lucide-react";
import useSockets from "../../../hooks/useSockets";

export default function FriendsTab() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState([]);

  const { socketLoading, data, emit } = useSockets({
    emitFlag: "search-users:get",
    onFlag: "search-users:return",
    initialState: [],
    debounceFlag: true,
  });

  useEffect(() => {
    if (!searchInput && foundUsers.length > 0) {
      setFoundUsers([]);
    }
    if (!searchInput) return;

    emit(searchInput);
  }, [searchInput, emit]);

  useEffect(() => {
    if (data && data.users && data.users.length > 0) {
      setFoundUsers(data.users);
    }
  }, [data]);

  return (
    <div>
      <form>
        <input
          required={true}
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full p-2 rounded border border-gray-300 text-black"
          placeholder="Find anybody..."
        />
      </form>
      {socketLoading && (
        <div>
          <Loader />
        </div>
      )}
      {!socketLoading && foundUsers.length === 0 && <div>No users found</div>}
      {!socketLoading && foundUsers.length > 0 && (
        <ul>
          {foundUsers.map((user) => (
            <li key={user.id}>
              <button>{user.username}</button>
            </li>
          ))}
          {/* <ul className="max-w-md space-y-1 text-gray-500 list-inside dark:text-gray-400"> */}
          <li className="flex items-center">
            <svg
              className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            At least 10 characters
          </li>
          <li className="flex items-center">
            <svg
              className="w-3.5 h-3.5 me-2 text-green-500 dark:text-green-400 flex-shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            At least one lowercase character
          </li>
          <li className="flex items-center">
            <svg
              className="w-3.5 h-3.5 me-2 text-gray-500 dark:text-gray-400 flex-shrink-0"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            At least one special character, e.g., ! @ # ?
          </li>
          {/* </ul> */}
        </ul>
      )}
    </div>
  );
}
