// export default function Avatar({ src, alt, children }) {
//   if (src) {
//     return (
//       <div className="avatar">
//         <img src={src} alt={alt} />
//       </div>
//     );
//   }
//   if (children) {
//     return <div className="avatar avatar-letters">{children}</div>;
//   } else {
//     return <div className="avatar avatar-icon">{/* <IoPersonSharp /> */}</div>;
//   }
// }
import { CircleUserRound } from "lucide-react";
export default function Avatar({
  avatarUrl,
  username,
}: {
  avatarUrl?: string | null;
  username?: string;
}) {
  console.log("avatarUrl ", avatarUrl);
  if (!avatarUrl) return <CircleUserRound size={100} strokeWidth={1} />;
  if (avatarUrl)
    return (
      <div className="w-[100px] h-[100px] border border-black rounded-full overflow-hidden">
        <img className="w-[100px]" src={avatarUrl} alt={username} />
      </div>
    );
}
