import { Dispatch, SetStateAction, useEffect, useState } from "react";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  CancelTokenSource,
} from "axios";
import { TDataBaseRequestData } from "../types";

export default function useFetchDB<T>(): {
  loading: boolean;
  isLoaded: boolean;
  data: T | null;
  error: string | Error;
  setFetchData: Dispatch<SetStateAction<TDataBaseRequestData | null>>;
} {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | Error>("");
  const [data, setData] = useState<T | null>(null);
  const [fetchData, setFetchData] = useState<TDataBaseRequestData | null>(null);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (fetchData === null) return;

    let source: CancelTokenSource = axios.CancelToken.source();

    const fetchStuff = async () => {
      setLoading(true);
      setIsLoaded(false);
      try {
        const axiosConfig: AxiosRequestConfig = {
          url: fetchData.url,
          method: fetchData.method,
          data: fetchData.body,
          withCredentials: true,
          headers: fetchData.headers || { "Content-Type": "application/json" },
          cancelToken: source.token,
        };

        if (fetchData.serialize) {
          axiosConfig.data = fetchData.serialize(fetchData.body);
        }

        const response = await axios(axiosConfig);
        setData(response.data);
      } catch (e) {
        if (axios.isCancel(e)) {
          console.log("Request canceled", e.message);
        } else if (e instanceof AxiosError) {
          setError(e.response?.data?.message || String(e));
        } else {
          // TODO: ask Artem if something even could be thrown here,
          // since we are in axios related try catch block
          throw new Error(e);
        }
      } finally {
        setLoading(false);
        setIsLoaded(true);
      }
    };

    fetchStuff();

    return () => {
      source.cancel("Operation canceled by the user.");
    };
  }, [fetchData]);

  return { loading, isLoaded, data, error, setFetchData };
}
