import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TDataBaseRequestData } from "../types";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();

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

        if (response.status != 200) {
          throw new Error(`Error with ${url} and ${method}`);
        }

        const data = await response.json();
        if (!ignore) {
          setData(data);
          setLoading(false);
          setIsLoaded(true);
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

  // return [loading, state, error, setFetchData];
  return { loading, isLoaded, data, error, setFetchData };
}
