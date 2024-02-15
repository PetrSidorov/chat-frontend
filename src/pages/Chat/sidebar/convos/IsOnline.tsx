export default function IsOnline({ online }: { online: boolean }) {
  return (
    <>
      {online && (
        <div className="w-2.5 h-2.5 bg-emerald-500 rounded-full absolute top-2 right-4"></div>
      )}
    </>
  );
}
