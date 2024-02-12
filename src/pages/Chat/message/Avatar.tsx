import { CircleUserRound } from "lucide-react";

// Renamed the component to avoid conflict with the <Avatar /> JSX element variable
export default function AvatarComponent({
  avatarUrl,
  username,
  avatar,
}: {
  avatarUrl?: string | null;
  username?: string;
  avatar?: JSX.Element;
}) {
  console.log("avatar ", avatar);

  // Directly return the avatar JSX if it's provided
  if (avatar) {
    return (
      <div className="w-[100px] h-[100px] border border-black rounded-full overflow-hidden">
        {avatar}
      </div>
    );
  } else {
    // Fallback to a default avatar if none is provided
    return <CircleUserRound size={100} strokeWidth={1} />;
  }
}
