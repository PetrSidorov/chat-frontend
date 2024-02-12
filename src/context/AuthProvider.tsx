import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TAuthContext, TUser } from "../types.ts";
import useFetchDB from "../hooks/useFetchDB.ts";

export const AuthContext = createContext<TAuthContext>([null, () => {}]);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null);
  const { loading, data, error, setFetchData } = useFetchDB<any>();
  useEffect(() => {
    if (!user) {
      setFetchData({
        url: "http://localhost:3007/api/user-data",
        method: "GET",
      });
    }
  }, []);

  useEffect(() => {
    setUser(data);
  }, [data]);

  const value = useMemo(() => {
    return [user, setUser] as [
      TUser | null,
      Dispatch<SetStateAction<TUser | null>>
    ];
  }, [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
