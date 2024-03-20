import { useContext, useEffect } from "react";
import useSockets from "./useSockets";
import useConvoSocketPoll from "./useConvoSocketPoll";
import { AllConvoContext } from "../context/AllConvoContext";

export default function useNewConvo() {
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const { convos, unshiftMessagesToConvo } =
    useContext(AllConvoContext).convoContext;
  const { joinRoom } = useConvoSocketPoll();

  const { socketLoading, data, emit } = useSockets({
    emitFlag: "convo:create",
    onFlag: "convo:return",
    initialState: {},
  });

  useEffect(() => {
    console.log("data in use new convo ", data);
    if (data && Object.keys(data).length === 0) return;
    // const [convoId, messages] = Object.entries(data)[0];
    const [convoId] = Object.entries(data)[0];

    // unshiftMessagesToConvo({ id: convoId, newMessages: [] });
    setActiveConvoId(convoId);
    joinRoom(convoId);
  }, [data]);

  return emit;
}
