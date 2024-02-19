import { CircleUserRound } from "lucide-react";
export default function Avatar({
  avatarUrl,
  username,
}: {
  avatarUrl?: string | null;
  username?: string;
}) {
  return (
    <>
      {avatarUrl ? (
        <div className="w-[100px] flex-none h-[100px] border border-black rounded-full overflow-hidden mx-auto">
          <img className="w-[100px]" src={avatarUrl} alt={username} />
        </div>
      ) : (
        <CircleUserRound
          className="flex-none mx-auto"
          size={100}
          strokeWidth={1}
        />
      )}
    </>
  );
}
