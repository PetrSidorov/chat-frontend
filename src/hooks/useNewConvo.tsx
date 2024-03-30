import { useContext, useEffect } from "react";
import useSockets from "./useSockets";
import useConvoSocketPoll from "./useConvoSocketPoll";
import { AllConvoContext } from "../context/AllConvoProvider";

export default function useNewConvo() {
  const [, handleActiveConvoId] = useContext(AllConvoContext).activeConvoId;
  const { convos, unshiftMessagesToConvo, addNewConvo } =
    useContext(AllConvoContext).convoContext;
  const { joinRoom } = useConvoSocketPoll();

  const { socketLoading, data, emit } = useSockets({
    emitFlag: "convo:create",
    onFlag: "convo:return",
    initialState: {},
  });

  useEffect(() => {
    console.log("data in use new convo ", data);
    if (!data || Object.keys(data).length == 0) return;
    const newConvoId = Object.keys(data)[0];

    addNewConvo(data);
    joinRoom(newConvoId);
    handleActiveConvoId(newConvoId);
  }, [data]);

  return emit;
}
