import { useEffect, useState } from "react";
import Message from "./Message";
import fetchDB from "../../utils/fetchDB";
import Convo from "./Convo";

export default function ConvosList() {
  const [convosData, setConvosData] = useState(null);

  useEffect(() => {
    fetchDB({
      method: "GET",
      url: "http://localhost:3007/api/last-ten-convos",
    }).then((data) => setConvosData(data));
  }, []);

  const convos = convosData?.map((convoData: any) => (
    <Convo data={convoData} />
  ));

  return (
    <ul className="font-semibold">
      {/* <Message /> */}
      {convos}
    </ul>
  );
}
