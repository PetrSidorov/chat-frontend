export default function EmptyConvo() {
  // TODO:CSS move this margin up

  return (
    <li className="flex items-center m-2 p-2 bg-gray-200 rounded">
      <div className="ml-2">
        <div className="flex justify-between mb-3">
          <span>This convo is empty, start chatting now</span>
        </div>
      </div>
    </li>
  );
}
