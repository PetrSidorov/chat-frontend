import { useContext, useEffect, useState } from "react";

import ConvoPreview from "./ConvoPreview";
import { AllConvoContext } from "../../../../context/AllConvoContext";
import useFetchDB from "../../../../hooks/useFetchDB";
import { ErrorBoundary } from "../../../../utils/ErrorBoundary";

export default function ConvosList() {
  const [convos, addMessagesToConvo] = useContext(AllConvoContext).convoContext;
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const [convosData, setConvosData] = useState([]);
  const [loading, data, error, setFetchData] = useFetchDB<any>();

  useEffect(() => {
    setFetchData({
      method: "GET",
      url: "http://localhost:3007/api/convo/last-ten-convos-with-ten-messages",
    });
  }, []);

  useEffect(() => {
    // console.log("error data ", data);
    for (let convoId in data) {
      addMessagesToConvo({ id: convoId, newMessages: data[convoId] });
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

  return (
    <ErrorBoundary fallback={<p>Something went wrong</p>}>
      <ul className="font-semibold">{ListOfConvoPreviews}</ul>
    </ErrorBoundary>
  );
}
