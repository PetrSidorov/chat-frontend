import { useEffect, useState } from "react";
import fetchDB from "../../utils/fetchDB";
import Convo from "./Convo";

export default function ConvosList({ setActiveConvo }) {
  const [convosData, setConvosData] = useState(null);

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
