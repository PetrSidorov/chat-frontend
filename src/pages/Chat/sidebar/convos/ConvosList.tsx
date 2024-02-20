import { useContext, useEffect } from "react";

import { AllConvoContext } from "../../../../context/AllConvoContext";
import { AuthContext } from "../../../../context/AuthProvider";
import useFetchDB from "../../../../hooks/useFetchDB";
import ConvoPreview from "./ConvoPreview";

export default function ConvosList() {
  const { convos, unshiftMessagesToConvo, initConvo } =
    useContext(AllConvoContext).convoContext;
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const { loading, isLoaded, data, error, setFetchData } = useFetchDB<any>();
  const [user, _] = useContext(AuthContext);

  useEffect(() => {
    setFetchData({
      method: "GET",
      url: "http://localhost:3007/api/convo/last-ten-convos-with-ten-messages",
    });
  }, []);

  useEffect(() => {
    if (!data || !user) return;
    console.log("data ", data);
    initConvo(data);
  }, [data, user]);

  const ListOfConvoPreviews =
    convos &&
    Object.entries(convos)?.map((convo: any) => {
      const [id, data] = convo;

      return (
        <div
          key={id}
          onClick={() => {
            setActiveConvoId(id);
          }}
        >
          <ConvoPreview
            receiver={data.receiver}
            messages={data.messages}
            online={data.online}
          />
        </div>
      );
    });

  return <ul className="font-semibold">{ListOfConvoPreviews}</ul>;
}
