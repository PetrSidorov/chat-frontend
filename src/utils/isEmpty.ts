export default function isEmpty(obj: Object | Array<any>) {
  return (
    obj !== null && typeof obj === "object" && Object.keys(obj).length == 0
  );
}
