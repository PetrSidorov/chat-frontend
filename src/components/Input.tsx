export default function Input({ value, inputHandler }) {
  return (
    <input
      type="text"
      value={message.content}
      onChange={messageHandler}
      className="w-full p-2 rounded border border-gray-300"
      placeholder="Type a message..."
    />
  );
}
