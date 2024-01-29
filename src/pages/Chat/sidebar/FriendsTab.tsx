import { useEffect, useState, useCallback } from "react";
import { socket } from "../../../utils/socket";
import { debounce } from "lodash";

export default function FriendsTab() {
  const [searchInput, setSearchInput] = useState<string>("");

  const debouncedSearch = useCallback(
    debounce((searchInput) => {
      socket.emit("search-users:get", searchInput);
    }, 500),
    []
  );

  useEffect(() => {
    socket.on("search-users:return", (data) => {
      console.log("data ", data);
    });

    return () => {
      socket.off("search-users:return");
      debouncedSearch.cancel();
    };
  }, []);

  useEffect(() => {
    if (!searchInput) return;
    debouncedSearch(searchInput);
  }, [searchInput, debouncedSearch]);

  return (
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
  );
}
