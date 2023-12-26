import { ReactNode, createContext, useState } from "react";

export const ActiveConvoContext = createContext([null, () => {}]);

export default function ActiveConvoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeConvo, setActiveConvo] = useState(null);
  return (
    <ActiveConvoContext.Provider value={[activeConvo, setActiveConvo]}>
      {children}
    </ActiveConvoContext.Provider>
  );
}
