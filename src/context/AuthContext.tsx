import { ReactNode, createContext, useState } from "react";
import { TAuthContext, TUser } from "../types.ts";

export const AuthContext = createContext<TAuthContext>([null, () => {}]);

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<TUser | null>(null);

  return (
    <AuthContext.Provider value={[user, setUser]}>
      {children}
    </AuthContext.Provider>
  );
}
