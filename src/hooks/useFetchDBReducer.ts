import {
  Dispatch,
  SetStateAction,
  useEffect,
  useReducer,
  useState,
} from "react";
import { TDataBaseRequestData } from "../types";
import { useNavigate } from "react-router-dom";

function reducer(fetchState, action: { type: string; data?: any }) {
  switch (action.type) {
    case "ignore-false": {
      return {
        ...fetchState,
        ignore: false,
      };
    }
    case "start-loading": {
      return {
        ...fetchState,
        loading: true,
        isLoaded: false,
      };
    }
    case "error": {
      return {
        ...fetchState,
        error: action.data,
      };
    }
    case "data-loaded": {
      return {
        ...fetchState,
        isLoaded: true,
        loading: false,
      };
    }
    case "data-set": {
      return {
        ...fetchState,
        data: action.data,
      };
    }
    case "ignore-true": {
      return {
        ...fetchState,
        ignore: false,
      };
    }
    case "set-fetch-data": {
      return {
        ...fetchState,
        fetchData: action.data,
      };
    }
  }
}
export default function useFetchDB<T>(): {
  loading: boolean;
  isLoaded: boolean;
  data: T | null;
  error: string | Error;
  setFetchData: Dispatch<SetStateAction<TDataBaseRequestData | null>>;
} {
  const [fetchState, dispatch] = useReducer(reducer, {
    loading: false,
    error: null,
    data: null,
    fetchData: null,
    isLoaded: false,
    ignore: false,
  });

  function setFetchData(data) {
    if (fetchState.loading) return;
    dispatch({
      type: "set-fetch-data",
      data,
    });
  }

  useEffect(() => {
    if (fetchState.fetchData == null) {
      return;
    }

    dispatch({
      type: "ignore-false",
    });
    const controller = new AbortController();

    const {
      url,
      method,
      body,
      serialize = JSON.stringify,
      headers = {
        "Content-Type": "application/json",
      },
    } = fetchState.fetchData;

    async function fetchStuff() {
      dispatch({
        type: "start-loading",
      });

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
          dispatch({
            type: "error",
            data: data.mesaage,
          });
        }

        if (!fetchState.ignore) {
          dispatch({
            type: "data-set",
            data: data,
          });
        }
      } catch (e) {
        if (!fetchState.ignore) {
          dispatch({
            type: "error",
            data: String(e),
          });
        }
      } finally {
        if (!fetchState.ignore) {
          dispatch({
            type: "data-loaded",
          });
        }
      }
    }

    fetchStuff();
    return () => {
      dispatch({
        type: "ignore-true",
      });
      controller.abort();
    };
  }, [fetchState.fetchData]);

  return {
    loading: fetchState.loading,
    isLoaded: fetchState.isLoaded,
    data: fetchState.data,
    error: fetchState.error,
    setFetchData,
  };
}
