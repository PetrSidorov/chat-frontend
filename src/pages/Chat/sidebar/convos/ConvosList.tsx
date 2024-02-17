import { useContext, useEffect, useState } from "react";

import { AllConvoContext } from "../../../../context/AllConvoContext";
import useConvoSocketPoll from "../../../../hooks/useConvoSocketPoll";
import useFetchDB from "../../../../hooks/useFetchDB";
import ConvoPreview from "./ConvoPreview";
import { AuthContext } from "../../../../context/AuthProvider";

export default function ConvosList() {
  const { convos, unshiftMessagesToConvo, initConvo } =
    useContext(AllConvoContext).convoContext;
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const { loading, isLoaded, data, error, setFetchData } = useFetchDB<any>();
  const [socketPoll, addConvoToSocketPoll] = useConvoSocketPoll();
  const [user, _] = useContext(AuthContext);

  useEffect(() => {
    setFetchData({
      method: "GET",
      url: "http://localhost:3007/api/convo/last-ten-convos-with-ten-messages",
    });
  }, []);

  useEffect(() => {
    if (!data || !user) return;
    // console.log("data is ", data);
    for (let convoId in data) {
      if (socketPoll && socketPoll.includes(convoId)) {
        break;
      }
      // console.log("data is", data[convoId].messages);
      initConvo({
        id: convoId,
        newMessages: data[convoId].messages,
        actors: data[convoId].actors,
      });

      const companionId =
        data[convoId].actors.initiator.id == user?.id
          ? data[convoId].actors.joiner.id
          : data[convoId].actors.initiator.id;

      addConvoToSocketPoll(convoId, companionId);
    }
  }, [data, user]);

  const ListOfConvoPreviews =
    convos &&
    Object.entries(convos)?.map((convo: any) => {
      const [id, data] = convo;

      return (
        <div
          key={id}
          // className="relative"
          onClick={() => {
            setActiveConvoId(id);
          }}
        >
          <ConvoPreview messages={data.messages} online={data.online} />
        </div>
      );
    });

  return <ul className="font-semibold">{ListOfConvoPreviews}</ul>;
}
