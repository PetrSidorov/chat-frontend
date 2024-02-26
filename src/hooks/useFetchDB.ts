import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TDataBaseRequestData } from "../types";

export default function useFetchDB<T>(): {
  loading: boolean;
  isLoaded: boolean;
  data: T | null;
  error: string | Error;
  setFetchData: Dispatch<SetStateAction<TDataBaseRequestData | null>>;
} {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | Error>("");
  const [data, setData] = useState<T | null>(null);
  const [fetchData, setFetchData] = useState<TDataBaseRequestData | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

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
      setLoading(true);
      setIsLoaded(false);
      try {
        const response = await fetch(url, {
          method,
          body: serialize(body),
          credentials: "include",
          headers,
          signal: controller.signal,
        });

        if (!response.ok) {
          // navigate("/");
        }
        // TODO: i will not get response in some cases, fix that
        const data = await response.json();
        if (response.status != 200) {
          setError(data.message);
          // setLoading(false);
          // setIsLoaded(true);
          // throw new Error(`Error with ${url} and ${method}`);
        }

        if (!ignore) {
          setData((curr) => data);
          // setLoading(false);
          // setIsLoaded(true);
        }
      } catch (e) {
        if (!ignore) {
          setError(String(e));
          // throw fetchData;
        }
      } finally {
        if (!ignore) {
          setLoading(false);
          setIsLoaded(true);
        }
      }
    }

    fetchStuff();
    return () => {
      ignore = true;
      controller.abort();
    };
  }, [fetchData]);

  return { loading, isLoaded, data, error, setFetchData };
}
