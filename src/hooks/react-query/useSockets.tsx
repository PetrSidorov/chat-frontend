import { TMessage } from "@/types";
import { socket } from "@/utils/socket";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
// TODO: this is a very much temporary stuff
const useSockets = (): [
  boolean,
  React.Dispatch<React.SetStateAction<boolean>>
] => {
  const [newMessage, setNewMessage] = useState(false);
  // const queryClient = useQueryClient();
  // queryClient.invalidateQueries({ queryKey: ["convos"] });
  socket.connect();
  useEffect(() => {
    console.log("socket.connected ", socket.connected);
    socket.on("msg:return", () => setNewMessage(true));
    return () => {
      socket.off("msg:return", () => setNewMessage(true));
    };
  }, [socket.connected]);

  return [newMessage, setNewMessage];
};
export default useSockets;
