import { useContext, useEffect } from "react";

import { AllConvoContext } from "../../../../context/AllConvoContext";
import { AuthContext } from "../../../../context/AuthProvider";
import useFetchDB from "../../../../hooks/useFetchDB";
import ConvoPreview from "./ConvoPreview";
import { useNavigate } from "react-router-dom";
import useRoomUsersStatus from "@/hooks/useRoomUsersStatus";

export default function ConvosList() {
  const { convos, unshiftMessagesToConvo, initConvo } =
    useContext(AllConvoContext).convoContext;
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const { loading, isLoaded, data, error, setFetchData } = useFetchDB<any>();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const onlineStatuses = useRoomUsersStatus();

  useEffect(() => {
    setFetchData({
      method: "GET",
      url: "http://localhost:3007/api/convo/last-ten-convos-with-ten-messages",
    });
  }, []);
  useEffect(() => {
    if (!data || !user) return;

    initConvo(data);
  }, [data, user]);

  const listOfConvoPreviews =
    convos &&
    Object.entries(convos)?.map((convo: any) => {
      const [id, data] = convo;
      const participantOnlineStatus = onlineStatuses[id]?.includes(
        data.participants[0].id
      );
      return (
        <div
          // className="h-[132px]"
          // className="h-[132px] overflow-hidden whitespace-nowrap overflow-ellipsis w-full"
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
          />
        </div>
      );
    });

  return (
    <>
      {listOfConvoPreviews && listOfConvoPreviews.length > 0 ? (
        <ul className="font-semibold">{listOfConvoPreviews}</ul>
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
