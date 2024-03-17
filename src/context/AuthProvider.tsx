import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import useFetchDB from "../hooks/useFetchDB";
import { TUser } from "../types";

type TAuthContext = {
  loading: boolean;
  user: TUser | null;
  isLoaded: boolean;
  userData: TUser | null;
  error: any;
  setUser: Dispatch<SetStateAction<TUser | null>> | (() => void);
};

const initialData = {
  loading: false,
  user: null,
  isLoaded: false,
  userData: null,
  error: null,
  setUser: () => {},
};

export const AuthContext = createContext<TAuthContext>(initialData);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null);
  const {
    loading,
    isLoaded,
    data: userData,
    error,
    setFetchData,
  } = useFetchDB<any>();

  useEffect(() => {
    if (!user) {
      setFetchData({
        url: "http://localhost:3007/api/user-data",
        method: "GET",
      });
    }
  }, [user]);

  useEffect(() => {
    setUser(userData);
  }, [userData]);

  const value = useMemo(() => {
    return { loading, user, isLoaded, userData, error, setUser };
  }, [loading, user, isLoaded, userData, error]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
