import useMessage from "../../hooks/useMessage";

export default function MessageManager() {
  const { message, setMessage, send } = useMessage();

  const handleSubmit = (e) => {
    e.preventDefault();
    send();
  };

  return (
    <form onSubmit={handleSubmit} className="message-form p-4 bg-gray-100 flex">
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        className="textarea w-full p-2 rounded border border-gray-300"
        onKeyDown={(e) => {
          if (e.key === "Enter" && e.shiftKey) {
          } else if (e.key === "Enter" && !e.shiftKey) {
            handleSubmit(e);
          }
        }}
      />
      <button
        type="submit"
        className="button bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded ml-2"
      >
        Send
      </button>
    </form>
  );
}
