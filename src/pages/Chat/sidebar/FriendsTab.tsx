import { socket } from "@/utils/socket";
import { motion } from "framer-motion";
import { Loader, Mail, UserCheck, UserPlus } from "lucide-react"; // Replace these with appropriate icons
import { useContext, useEffect, useState } from "react";
import { AllConvoContext } from "../../../context/AllConvoProvider";
import useNewConvo from "../../../hooks/useNewConvo";

type Tuser = {
  username: string;
  id: string;
  convos: string[];
  online: boolean;
};
// {
//   "username": "peter2",
//   "id": "643d238a-fb1d-4b0d-85e8-03f643e66eb1",
//   "convos": [
//       "dce4b862-4851-4c27-a44c-4ad42495a879"
//   ],
//   "online": true
// }

export default function FriendsTab() {
  const [searchInput, setSearchInput] = useState("");
  const [foundUsers, setFoundUsers] = useState<Tuser[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const emitNewConvo = useNewConvo();

  function emitSearch(searchInput: string) {
    setLoading(true);
    socket.emit("search-users:get", searchInput);
  }

  function getSearchResults(data: Tuser[]) {
    setFoundUsers(data);
    setLoading(false);
  }

  useEffect(() => {
    if (!searchInput && foundUsers.length > 0) {
      setFoundUsers([]);
    }
    if (!searchInput) return;

    // socket.emit("search-users:get", searchInput);
    emitSearch(searchInput);
    // socket.on("search-users:return", setFoundUsers);
    socket.on("search-users:return", getSearchResults);

    return () => {
      socket.off("search-users:get");
    };
  }, [searchInput]);

  return (
    // TODO:CSS move this padding up if possible
    // review why here is padding and the padding on the form inside,
    //  is it necessary?
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
      {loading && (
        <div className="flex justify-center items-center">
          <Loader className="text-indigo-500" size={32} />
        </div>
      )}
      {!loading && searchInput && foundUsers.length === 0 && (
        <div className="text-center text-gray-600">No users found</div>
      )}
      {foundUsers.length > 0 && (
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
                  return user.convos[0]
                    ? setActiveConvoId(user.convos[0])
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
