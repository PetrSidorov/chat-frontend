import axios, { AxiosError, isAxiosError } from "axios";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { TUser } from "../types";
import { socket } from "@/utils/socket";

type TAuthContext = {
  loading: boolean;
  status: number;
  user: TUser | null;
  setUser: Dispatch<SetStateAction<TUser | null>> | (() => void);
};

const initialData = {
  loading: false,
  status: 0,
  user: null,
  setUser: () => {},
};

export const AuthContext = createContext<TAuthContext>(initialData);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null);
  const [status, setStatus] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // server nor functioning
    // user not found
    // permission denied

    const getUser = async () => {
      if (user) return;
      setLoading(true);
      try {
        const response = await axios.get("http://localhost:3007/api/me", {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        });
        console.log("response data ", response.data);
        setUser(response.data);
        setStatus(response.status);
        // TODO:TYPESCRIPT ask Artem
        // if (e instanceof AxiosError... blabla else what ?)
      } catch (e) {
        // if (isAxiosError(e)) {
        //   e.
        // }
        if (e instanceof AxiosError && e.response) {
          // TODO: if no response
          setStatus(e.response.status);
        } else {
          // ignore error
        }
      } finally {
        setLoading(false);
      }
    };

    getUser();
  }, []);

  const value = useMemo(() => {
    return { user, setUser, setStatus, status, loading };
  }, [user, setUser, setStatus, status, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
