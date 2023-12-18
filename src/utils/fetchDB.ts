export default function fetchDB({
  method,
  url,
  body,
}: {
  method: string;
  url: string;
}) {
  return fetch(url, {
    method,
    body: JSON.stringify(body),
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  })
    .then((response) => response.json())
    .catch((error) => console.error(`Error with ${url} and ${method}`, error));
}
