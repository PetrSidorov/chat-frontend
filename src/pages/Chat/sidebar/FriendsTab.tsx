import { useEffect, useState, useContext } from "react";
import { Loader, UserPlus, UserCheck, Mail } from "lucide-react"; // Replace these with appropriate icons
import useSockets from "../../../hooks/useSockets";
import { AllConvoContext } from "../../../context/AllConvoContext";
import useNewConvo from "../../../hooks/useNewConvo";
import { motion } from "framer-motion";

export default function FriendsTab() {
  const [searchInput, setSearchInput] = useState("");
  const [foundUsers, setFoundUsers] = useState([]);
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const emitNewConvo = useNewConvo();

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
    if (data && data.length > 0) {
      setFoundUsers(data);
    }
  }, [data]);

  return (
    <div className="p-4">
      <form className="mb-4">
        <input
          required
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          className="w-full p-3 rounded-lg border border-gray-300 text-black shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          placeholder="Find anybody..."
        />
      </form>
      {socketLoading && (
        <div className="flex justify-center items-center">
          <Loader className="text-indigo-500" size={32} />
        </div>
      )}
      {!socketLoading && foundUsers.length === 0 && (
        <div className="text-center text-gray-600">No users found</div>
      )}
      {!socketLoading && foundUsers.length > 0 && (
        <ul className="space-y-2">
          {foundUsers.map((user) => (
            <motion.li
              key={user.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="cursor-pointer hover:bg-gray-100 p-2 rounded-lg"
            >
              <button
                className="flex items-center space-x-3"
                onClick={() => {
                  return user.convos[0]?.id
                    ? setActiveConvoId(user.convos[0].id)
                    : emitNewConvo([user.id]);
                }}
              >
                {user.online ? (
                  <UserCheck size={20} className="text-green-500" />
                ) : (
                  <UserPlus size={20} className="text-gray-500" />
                )}
                <span className="flex-grow text-gray-800">{user.username}</span>
                {user.convos.length > 0 ? (
                  <Mail size={20} className="text-blue-500" />
                ) : (
                  <Mail size={20} className="text-gray-400" />
                )}
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
