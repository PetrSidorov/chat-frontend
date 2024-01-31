import { useContext, useEffect } from "react";
import useSockets from "./useSockets";
import useConvoSocketPoll from "./useConvoSocketPoll";
import { AllConvoContext } from "../context/AllConvoContext";

export default function useNewConvo() {
  const [, setActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const { convos, addOffsetMessagesToConvo } =
    useContext(AllConvoContext).convoContext;
  const [addToSocketPoll, addConvoToSocketPoll] = useConvoSocketPoll();

  const { socketLoading, data, emit } = useSockets({
    emitFlag: "convo:create",
    onFlag: "convo:return",
    initialState: {},
  });

  useEffect(() => {
    //TODO: wat. check if that's even working
    if (!data) return;
    const [convoId, messages] = Object.entries(data);
    setActiveConvoId(convoId);
    addOffsetMessagesToConvo({ id: convoId, newMessages: messages });
    addConvoToSocketPoll(convoId);
  }, [data]);

  return emit;
}
