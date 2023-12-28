import { useEffect, useState } from "react";
import fetchDB from "../../utils/fetchDB";
import Convo from "./Convo";
import { socket } from "../../utils/socket";

export default function ConvosList() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [convosData, setConvosData] = useState([]);

  useEffect(() => {
    function onConnect() {
      console.log("socket connect");
      setIsConnected(true);
    }

    function onDisconnect() {
      console.log("socket disconnect");
      setIsConnected(false);
    }

    socket.on("connect_error", (error) => {
      console.log("Connection Error:", error);
    });

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    socket.on("msg:get", (data) => {
      console.log("server says hi ", data);
      setConvosData((prev) => {
        const convosFiltered = prev.filter((convo) => convo.id != data.id);
        return [...convosFiltered, data];
      });
    });

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
    };
  }, []);

  useEffect(() => {
    socket.on("msg:send", (message) => {
      // convoToAdd = convos.filter((convo) => (convo.id = message.convoId));
      setConvosData((prevConvos) => {
        const convoToAdd = prevConvos.filter(
          (convo) => convo.id == message.convoId
        );
        convoToAdd[0].messages.push(message);

        const convosFiltered = prevConvos.filter(
          (convo) => convo.id != convoToAdd[0].id
        );
        console.log("convoToAdd: ", convoToAdd);

        // return [...convosFiltered, convoToAdd];
        return prevConvos;
      });
    });

    return () => {
      socket.off("msg:get");
    };
  }, []);

  useEffect(() => {
    console.log("test", convosData);
  }, [convosData]);

  // useEffect(() => {
  //   fetchDB({
  //     method: "GET",
  //     url: "http://localhost:3007/api/last-ten-convos",
  //   }).then((data) => {
  //     setConvosData(data);
  //     console.log("data hello ", data);
  //   });
  // }, []);

  const convos = convosData?.map((convoData: any) => (
    <Convo currUser={convoData.currUser} key={convoData.id} data={convoData} />
  ));

  return <ul className="font-semibold">{convos}</ul>;
}
