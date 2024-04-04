import { AllConvoContext } from "@/context/AllConvoProvider";
import axios from "axios";
import { CSSProperties, Dispatch, SetStateAction, useContext } from "react";

interface ConvoContextMenuProps {
  id: string;
  style: CSSProperties;
  setShowContextMenu: Dispatch<SetStateAction<boolean>>;
}

export default function ConvoContextMenu({
  id,
  style,
  setShowContextMenu,
}: ConvoContextMenuProps) {
  const { removeConvo: removeConvoLocally } = useContext(AllConvoContext);
  const [activeConvoId, handleActiveConvoId] =
    useContext(AllConvoContext).activeConvoId;
  async function removeConvo(id: string) {
    const response = await axios.delete(
      `http://localhost:3007/api/convo/${id}`,
      {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    // Technically there's no way status is not 200
    // when getting response.data == id,
    // but i check status for consistency
    console.log("response is ", response);
    if (response.status == 200 && response.data.id == id) {
      removeConvoLocally(id);
      handleActiveConvoId(null);
    }
  }

  return (
    <div
      // TODO:CSS move this inset up if possible
      className="fixed inset-0"
      onClick={() => setShowContextMenu(false)}
      onContextMenu={() => setShowContextMenu(false)}
    >
      <div style={style}>
        <button
          onClick={() => removeConvo(id)}
          className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
        >
          Delete convo
        </button>
      </div>
    </div>
  );
}
