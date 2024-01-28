import { useEffect, useState } from "react";
import { socket } from "../../../utils/socket";

export default function FriendsTab() {
  const [searchInput, setSearchInput] = useState<string>("");

  function handleSearch(searchInput: string) {
    socket.emit("search-users:get", searchInput);
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => handleSearch(searchInput), 500);

    return () => clearTimeout(timeoutId);
  }, [searchInput]);

  return (
    <form>
      <input
        type="text"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
        className="w-full p-2 rounded border border-gray-300 text-black"
        placeholder="Find anybody..."
      />
    </form>
  );
}
