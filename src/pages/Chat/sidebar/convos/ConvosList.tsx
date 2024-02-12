import { useContext, useEffect, useState } from "react";

import { AllConvoContext } from "../../../../context/AllConvoContext";
import useConvoSocketPoll from "../../../../hooks/useConvoSocketPoll";
import useFetchDB from "../../../../hooks/useFetchDB";
import ConvoPreview from "./ConvoPreview";

export default function ConvosList() {
  const { convos, unshiftMessagesToConvo, initConvo } =
    useContext(AllConvoContext).convoContext;
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const { loading, isLoaded, data, error, setFetchData } = useFetchDB<any>();
  const [socketPoll, addConvoToSocketPoll] = useConvoSocketPoll();

  useEffect(() => {
    setFetchData({
      method: "GET",
      url: "http://localhost:3007/api/convo/last-ten-convos-with-ten-messages",
    });
  }, []);

  useEffect(() => {
    if (!data) return;
    console.log("data ", data);
    for (let convoId in data) {
      if (socketPoll && socketPoll.includes(convoId)) {
        break;
      }
      initConvo({
        id: convoId,
        newMessages: data[convoId].messages,
        actors: data[convoId].actors,
      });
      addConvoToSocketPoll(convoId);
    }
  }, [data]);

  const ListOfConvoPreviews =
    convos &&
    Object.entries(convos)?.map((convo: any) => {
      const [id, messages] = convo;

      return (
        <div
          key={id}
          onClick={() => {
            setActiveConvoId(id);
          }}
        >
          <ConvoPreview key={id} messages={messages} />
        </div>
      );
    });

  return <ul className="font-semibold">{ListOfConvoPreviews}</ul>;
}
