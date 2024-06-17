// import { AllConvoContext } from "@/context/AllConvoProvider";
import { MessageContext } from "@/context/MessageProvider";
import useGetUser from "@/hooks/react-query/useGetUser";
import { useDeleteMessage } from "@/hooks/react-query/useHandleMessage";
import useActiveConvoIdStore from "@/store";
import { useContext } from "react";

export default function MessageContextMenu({
  yours,

  content,
  uuid,
}: {
  yours: boolean;

  content: string;
  uuid: string;
}) {
  const { user } = useGetUser();
  // const [convoId, handleActiveConvoId] =
  //   useContext(AllConvoContext).activeConvoId;
  const activeConvoId = useActiveConvoIdStore((state) => state.activeConvoId);
  const { mutate: deleteMessage, isPending } = user
    ? useDeleteMessage(activeConvoId)
    : // TODO: #ask-artem is this even a ghood option,
      // i guess i can throw errors here
      { mutate: () => {}, isPending: false };

  const { setMessageEdited, setEditMessageMode } = useContext(MessageContext)!;
  return (
    <>
      {yours ? (
        <ul>
          <li className="flex flex-col mr-2">
            <button className="text-start" onClick={() => deleteMessage(uuid)}>
              <span id="test" className="text-red-700">
                Delete message
              </span>
            </button>
            <button
              className="text-start"
              onClick={() => {
                setMessageEdited({
                  messageId: uuid,
                  content,
                });
                setEditMessageMode(true);
              }}
            >
              <span id="test">Edit message</span>
            </button>
          </li>
        </ul>
      ) : (
        <div>you can't</div>
      )}
    </>
  );
}
