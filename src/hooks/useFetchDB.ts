import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TDataBaseRequestData } from "../types";

export default function useFetchDB<T>(): [
  boolean,
  T | null,
  string | Error,
  Dispatch<SetStateAction<TDataBaseRequestData | null>>
] {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | Error>("");
  const [state, setState] = useState<T | null>(null);
  const [fetchData, setFetchData] = useState<TDataBaseRequestData | null>(null);

  useEffect(() => {
    if (fetchData == null) {
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

    // let data;

    async function fetchStuff() {
      try {
        const response = await fetch(url, {
          method,
          body: serialize(body),
          credentials: "include",
          headers,
        });

        if (response.status != 200) {
          throw new Error(`Error with ${url} and ${method}`);
        }

        const data = await response.json();
        setState(data);
        setLoading(false);
      } catch (e) {
        setError(String(e));
        throw fetchData;
      } finally {
        setLoading(false);
      }
    }

    // function doStuff() {}

    // fetchStuff().then(() => {
    //   if (data) {
    //     doStuff();
    //   }
    // });

    fetchStuff();

    // if (data) {
    //   doStuff();
    // }
  }, [fetchData]);

  return [loading, state, error, setFetchData];
}
