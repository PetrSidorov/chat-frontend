import { socket } from "@/utils/socket";
import { motion } from "framer-motion";
import { Loader, Mail, UserCheck, UserPlus } from "lucide-react"; // Replace these with appropriate icons
import { useContext, useEffect, useState } from "react";
import { AllConvoContext } from "../../../context/AllConvoProvider";
import useCreateConvo from "@/hooks/react-query/useCreateConvo";
import useGetUser from "@/hooks/react-query/useGetUser";

type Tuser = {
  username: string;
  id: string;
  convos: string[];
  online: boolean;
};

export default function FriendsTab() {
  const [searchInput, setSearchInput] = useState("");
  const [foundUsers, setFoundUsers] = useState<Tuser[]>([]);
  const [loading, setLoading] = useState(false);
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const [, handleActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const { convos, unshiftMessagesToConvo, addNewConvo } =
    useContext(AllConvoContext).convoContext;
  const { user, isError, isFetching, error } = useGetUser();

  // const emitNewConvo = useNewConvo();
  // useEffect(() => {
  //   socket.on("convo:created", createNewConvo);

  //   return () => {
  //     socket.off("convo:created", createNewConvo);
  //   };
  // }, []);

  // function createNewConvo(data: any) {
  //   if (!data || Object.keys(data.convo).length == 0) return;

  //   const newConvoId = Object.keys(data.convo)[0];
  //   addNewConvo(data.convo);
  //   socket.emit("room:join", newConvoId);
  //   handleActiveConvoId(newConvoId);
  //   setFoundUsers((currUsers) => {
  //     const updatedUsers = currUsers.map((user) => {
  //       if (
  //         data.participants.some(
  //           (participant: string) => participant === user.id
  //         )
  //       ) {
  //         return {
  //           ...user,
  //           convos: [
  //             ...user.convos,
  //             {
  //               participants: data.convo[newConvoId].participants,
  //               id: newConvoId,
  //             },
  //           ],
  //         };
  //       } else {
  //         return user;
  //       }
  //     });
  //     console.log("updatedUsers ", updatedUsers);
  //     return updatedUsers;
  //   });
  // }

  const { mutate, isPending } = user
    ? useCreateConvo(user.id)
    : // TODO: #ask-artem is this even a ghood option,
      // i guess i can throw errors here
      { mutate: () => {}, isPending: false };

  function emitSearch(searchInput: string) {
    // console.log("socket state is ", socket);
    // console.log("searchInput is emitted ", searchInput);
    setLoading(true);
    socket.emit("search-users:get", searchInput);
  }

  function getSearchResults(data: Tuser[]) {
    // console.log("data is ", data);
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
                className="w-full"
                onClick={() => {
                  mutate(user.id);
                  // console.log("click on user ", user);
                  // if (user.convos[0]) {
                  //   console.log("if (user.convos[0]) ", user.convos[0]);
                  //   setActiveConvoId(user.convos[0].id);
                  // } else {
                  //   console.log("socket emit");
                  //   socket.emit("convo:create", [user.id]);
                  // }
                }}
              >
                <div className="flex w-[60%]">
                  {user.online ? (
                    <UserCheck size={20} className="text-green-500" />
                  ) : (
                    <UserPlus size={20} className="text-gray-500" />
                  )}
                  <span className="text-gray-800 ml-3">{user.username}</span>
                  {user.convos.length > 0 ? (
                    <Mail size={20} className="text-blue-500 ml-auto" />
                  ) : (
                    <Mail size={20} className="text-gray-400 ml-auto" />
                  )}
                </div>
              </button>
            </motion.li>
          ))}
        </ul>
      )}
    </div>
  );
}
