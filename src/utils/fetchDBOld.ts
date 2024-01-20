import { useState } from "react";

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
  // const [loading, setLoading] = useState<boolean>(false);
  // const [error, setError] = useState<string>("");

  return fetch(url, {
    method,
    body: serialize(body),
    credentials: "include",
    headers,
  })
    .then((response) => {
      if (response.status != 200) {
        throw new Error(`Error with ${url} and ${method}`);
      }
      return response.json();
    })
    .catch((error) => console.error(`Error with ${url} and ${method}`, error));
}
