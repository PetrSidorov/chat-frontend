import { useEffect, useState, useCallback, useContext } from "react";
import { Loader } from "lucide-react";
import useSockets from "../../../hooks/useSockets";
import { MessageSquare } from "lucide-react";
import { AllConvoContext } from "../../../context/AllConvoContext";
import useNewConvo from "../../../hooks/useNewConvo";

export default function FriendsTab() {
  const [searchInput, setSearchInput] = useState<string>("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const emitNewConvo = useNewConvo();

  const { socketLoading, data, emit } = useSockets({
    emitFlag: "search-users:get",
    onFlag: "search-users:return",
    initialState: [],
    debounceFlag: true,
  });

  function createNewConvo(secondUserId: string) {
    emitNewConvo(secondUserId);
  }

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
      console.log(data.users);
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
              <button
                className="flex items-center"
                onClick={() =>
                  user.convos[0]?.id
                    ? setActiveConvoId(user.convos[0].id)
                    : createNewConvo(user.id)
                }
              >
                <MessageSquare
                  color={user.convos.length > 0 ? "green" : "gray"}
                />
                {user.username}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
