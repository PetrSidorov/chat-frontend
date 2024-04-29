import { AllConvoContext } from "@/context/AllConvoProvider";
import axios from "axios";
import { useContext } from "react";

interface ConvoContextMenuProps {
  id: string;
}

export default function ConvoContextMenu({ id }: ConvoContextMenuProps) {
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

    if (response.status == 200 && response.data.id == id) {
      // TODO: animation for convo deletion
      handleActiveConvoId(null);
      removeConvoLocally(id);
    }
  }

  return (
    <div>
      <button
        onClick={() => removeConvo(id)}
        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded shadow-lg"
      >
        Delete convo
      </button>
    </div>
  );
}
