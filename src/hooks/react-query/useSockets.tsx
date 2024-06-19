import { socket } from "@/utils/socket";
import { useEffect } from "react";

const handleNewMessage = (data: any) => {
  console.log("newMessage ", data);
};

const useSockets = () => {
  socket.connect();
  useEffect(() => {
    console.log("socket.connected ", socket.connected);
    socket.on("msg:return", handleNewMessage);
    return () => {
      socket.off("msg:return", handleNewMessage);
    };
  }, [socket.connected]);
};
export default useSockets;
