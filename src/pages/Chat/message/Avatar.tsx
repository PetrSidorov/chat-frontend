import { CircleUserRound } from "lucide-react";
export default function Avatar({
  avatarUrl,
  username,
}: {
  avatarUrl?: string | null;
  username?: string;
}) {
  if (!avatarUrl) return <CircleUserRound size={100} strokeWidth={1} />;

  return (
    <div className="w-[100px] h-[100px] border border-black rounded-full overflow-hidden">
      <img className="w-[100px]" src={avatarUrl} alt={username} />
    </div>
  );
}
