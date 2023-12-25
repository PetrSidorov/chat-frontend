import Avatar from "./Avatar";
export default function Message() {
  return (
    <li className="flex items-center">
      <Avatar />
      <div className="ml-2">
        <div className="flex justify-between mb-3">
          <span>Name</span> <span>date</span>
        </div>
        <div>The messsage starts with...</div>
      </div>
    </li>
  );
}
