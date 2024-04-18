import { useContext, useEffect, useState } from "react";

import useRoomUsersStatus from "@/hooks/useRoomUsersStatus";
import axios from "axios";
import { AllConvoContext } from "../../../../context/AllConvoProvider";
import { AuthContext } from "../../../../context/AuthProvider";
import ConvoPreview from "./ConvoPreview";

export default function ConvosList() {
  const { convos, unshiftMessagesToConvo, initConvo } =
    useContext(AllConvoContext).convoContext;
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const { user } = useContext(AuthContext);
  const onlineStatuses = useRoomUsersStatus();

  useEffect(() => {
    const getConvos = async () => {
      if (!user) return;
      const response = await axios.get(
        // TODO: add sockets for handling more then 10 convos
        "http://localhost:3007/api/convo/last-ten-convos-with-ten-messages",
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      // TODO:TYPESCRIPT implement casting with 'as' in fetches like in the example below
      // const data = fetch("bla").then((res) => {
      //   return res.json;
      // });

      // return data as Something
      initConvo(response.data);
    };
    getConvos();
  }, []);

  const listOfConvoPreviews =
    convos &&
    Object.entries(convos)?.map((convo: any) => {
      const [id, data] = convo;
      // TODO: check this thing below and make it more declarative
      const participantOnlineStatus = onlineStatuses[id]?.includes(
        data.participants[0].id
      );

      return (
        <div
          className="h-auto max-h-[132px] overflow-hidden w-full "
          key={id}
          onClick={() => {
            setActiveConvoId(id);
          }}
        >
          <ConvoPreview
            participants={data.participants}
            messages={data.messages}
            online={participantOnlineStatus}
            id={id}
          />
        </div>
      );
    });

  return (
    <>
      {listOfConvoPreviews && listOfConvoPreviews.length > 0 ? (
        <>
          <ul className="font-semibold">{listOfConvoPreviews}</ul>
        </>
      ) : (
        <div className="text-center">
          <h3 className="mt-2 text-2xl font-semibold text-white-900">
            You have no messages yet
          </h3>
        </div>
      )}
    </>
  );
}
