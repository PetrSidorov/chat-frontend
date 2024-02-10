import { useContext, useEffect } from "react";
import useSockets from "./useSockets";
import useConvoSocketPoll from "./useConvoSocketPoll";
import { AllConvoContext } from "../context/AllConvoContext";

export default function useNewConvo() {
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const { convos, unshiftMessagesToConvo } =
    useContext(AllConvoContext).convoContext;
  const [addToSocketPoll, addConvoToSocketPoll] = useConvoSocketPoll();

  const { socketLoading, data, emit } = useSockets({
    emitFlag: "convo:create",
    onFlag: "convo:return",
    initialState: {},
  });

  useEffect(() => {
    if (data && Object.keys(data).length === 0) return;
    const [convoId, messages] = Object.entries(data)[0];

    setActiveConvoId(convoId);
    unshiftMessagesToConvo({ id: convoId, newMessages: messages });
    addConvoToSocketPoll(convoId);
  }, [data]);

  return emit;
}
