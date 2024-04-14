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
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // server nor functioning
    // user not found
    // permission denied

    const getUser = async () => {
      // TODO: early return
      setLoading(true);
      if (!user) {
        try {
          // TODO: api/me naming
          const response = await axios.get(
            "http://localhost:3007/api/user-data",
            {
              withCredentials: true,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
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
        }
      }
      setLoading(false);
    };

    getUser();
  }, []);

  useEffect(() => {
    console.log("user ", user);
  }, [user]);

  const value = useMemo(() => {
    return { user, setUser, setStatus, status, loading };
  }, [user, status, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
