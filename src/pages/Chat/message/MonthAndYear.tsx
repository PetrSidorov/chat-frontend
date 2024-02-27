export default function MonthAndYear({ createdAt }: { createdAt: string }) {
  const createdAtDate = new Date(createdAt);
  const isSameYear = createdAtDate.getFullYear() === new Date().getFullYear();

  const dateString = createdAtDate.toLocaleString("en-US", {
    month: "long",
    day: "numeric",
    ...(isSameYear ? {} : { year: "numeric" }),
  });
  return (
    <div className="w-fit mx-auto">
      <p>{dateString}</p>
    </div>
  );
}
