import { useEffect, useState } from "react";
import fetchDB from "../../utils/fetchDB";
import Convo from "./Convo";
import { socket } from "../../utils/socket";

export default function ConvosList({ setActiveConvo }) {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [convosData, setConvosData] = useState(null);

  useEffect(() => {
    // function onConnect() {
    //   console.log("socket connect");
    //   setIsConnected(true);
    // }

    // function onDisconnect() {
    //   console.log("socket disconnect");
    //   setIsConnected(false);
    // }

    // socket.on("connect_error", (error) => {
    //   console.log("Connection Error:", error);
    // });

    // socket.on("connect", onConnect);
    // socket.on("disconnect", onDisconnect);

    socket.on("hi", () => console.log("server says hi"));

    return () => {
      // socket.off("connect", onConnect);
      // socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    fetchDB({
      method: "GET",
      url: "http://localhost:3007/api/last-ten-convos",
    }).then((data) => {
      setConvosData(data);
      console.log("data hello ", data);
    });
  }, []);

  const convos = convosData?.map((convoData: any) => (
    <Convo key={convoData.id} data={convoData} />
  ));

  return <ul className="font-semibold">{convos}</ul>;
}
