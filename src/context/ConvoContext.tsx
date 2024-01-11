import { ReactNode, createContext, useState } from "react";

export const ConvoContext = createContext([null, () => {}]);

export default function ConvoProvider({ children }: { children: ReactNode }) {
  const [convo, setConvo] = useState(null);
  return (
    <ConvoContext.Provider value={[convo, setConvo]}>
      {children}
    </ConvoContext.Provider>
  );
}
