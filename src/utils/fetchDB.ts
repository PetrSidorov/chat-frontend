type TypeHttpHeaders = {
  [key: string]: string;
};

export default function fetchDB({
  method,
  url,
  body,
  serialize = JSON.stringify,
  headers = { "Content-Type": "application/json" },
}: {
  method: string;
  url: string;
  body?: Object | string;
  serialize?: Function;
  headers?: TypeHttpHeaders;
}) {
  return fetch(url, {
    method,
    body: serialize(body),
    credentials: "include",
    headers,
  })
    .then((response) => response.json())
    .catch((error) => console.error(`Error with ${url} and ${method}`, error));
}
