import { useContext, useEffect, useState } from "react";
import fetchDB from "../../utils/fetchDB";
import Convo from "./Convo";
import { ActiveConvoContext } from "../../context/ActiveConvoContext";

export default function ConvosList() {
  const [activeConvo, setActiveConvo] = useContext(ActiveConvoContext);

  // const [isConnected, setIsConnected] = useState(socket.connected);
  const [convosData, setConvosData] = useState([]);

  useEffect(() => {
    fetchDB({
      method: "GET",
      url: "http://localhost:3007/api/convo/last-ten-convos-with-ten-messages",
    }).then((data) => setConvosData(data));
    console.log("convosData: ", convosData);
  }, []);

  const convos = convosData?.map((convoData: any) => {
    const { initiator, joiner, initiatorId, joinerId, id, messages } =
      convoData;

    return (
      <div
        onClick={() => {
          setActiveConvo({
            id,
            initiator,
            joiner,
            initiatorId,
            joinerId,
            messages,
          });
        }}
      >
        <Convo key={convoData.id} data={convoData} />
        {/* <Convo key={convoData.id} /> */}
      </div>
    );
  });

  return <ul className="font-semibold">{convos}</ul>;
}
