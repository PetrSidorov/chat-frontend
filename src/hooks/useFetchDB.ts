import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TDataBaseRequestData } from "../types";

/**
 * does bla bla bla
 * @returns
 */
export default function useFetchDB<T>(): [
  boolean,
  T | null,
  string | Error,
  Dispatch<SetStateAction<TDataBaseRequestData | null>>
] {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | Error>("");
  const [state, setState] = useState<T | null>(null);
  const [fetchData, setFetchData] = useState<TDataBaseRequestData | null>(null);

  function fetchStuff() {
    ///
  }

  useEffect(() => {
    if (fetchData == null) {
      return;
    }

    let ignore = false;
    const controller = new AbortController();

    const {
      url,
      method,
      body,
      serialize = JSON.stringify,
      headers = {
        "Content-Type": "application/json",
      },
    } = fetchData;

    async function fetchStuff() {
      try {
        const response = await fetch(url, {
          method,
          body: serialize(body),
          credentials: "include",
          headers,
          signal: controller.signal,
        });

        if (response.status != 200) {
          throw new Error(`Error with ${url} and ${method}`);
        }

        const data = await response.json();
        if (!ignore) {
          setState(data);
          setLoading(false);
        }
      } catch (e) {
        if (!ignore) {
          setError(String(e));
          throw fetchData;
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchStuff();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [fetchData]);

  return [loading, state, error, setFetchData];
  // return { loading, data, error, refetch };
}
