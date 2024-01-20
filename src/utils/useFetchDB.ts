import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TDataBaseRequestData } from "../types";

export default function useFetchDB<T>(): [
  boolean,
  T | null,
  SetStateAction<Dispatch<any>>
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [state, setState] = useState<T | null>(null);
  const [fetchData, setFetchData] = useState<TDataBaseRequestData | null>(null);

  useEffect(() => {
    if (fetchData === null) {
      return;
    }
    const {
      url,
      method,
      body,
      serialize = JSON.stringify,
      headers = {
        "Content-Type": "application/json",
      },
    } = fetchData;
    console.log(fetchData);
    fetch(url, {
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
      .then((data) => {
        console.log("data in usefetch: ", data);
        setState(data);
        setLoading(false);
      })
      .catch((error) => setError(error))
      .finally(() => {
        setLoading(false);
      });
  }, [fetchData]);

  console.log(state);
  return [loading, state, setFetchData];
}
