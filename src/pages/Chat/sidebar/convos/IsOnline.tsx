import { cn } from "@/utils/cn";

export default function IsOnline({
  online,
  className,
}: {
  online: boolean;
  className?: string;
}) {
  return (
    <>
      {online && (
        <div
          className={cn("w-2.5 h-2.5 bg-emerald-500 rounded-full", className)}
        ></div>
      )}
    </>
  );
}
