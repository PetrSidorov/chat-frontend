import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TAuthContext, TUser } from "../types";
import useFetchDB from "../hooks/useFetchDB";

export const AuthContext = createContext<TAuthContext | null>(null);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null);
  const { loading, isLoaded, data, error, setFetchData } = useFetchDB<any>();

  useEffect(() => {
    if (!user && !isLoaded && !loading) {
      setFetchData({
        url: "http://localhost:3007/api/user-data",
        method: "GET",
      });
    }
  }, [user, isLoaded]);

  useEffect(() => {
    if (error === "notoken") {
      setUser(null);
    }
  }, [error]);

  useEffect(() => {
    // TODO: should onject is or something
    if (data !== user) {
      setUser(data);
    }
  }, [data, user]);

  const value = useMemo(() => {
    return { loading, user, isLoaded, data, error, setUser };
  }, [loading, user, isLoaded, data, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
