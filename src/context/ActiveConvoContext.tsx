import { ReactNode, createContext, useState } from "react";
import { TActiveConvoContext, TActiveConvoContextValue } from "../types";

export const ActiveConvoContext = createContext<TActiveConvoContext>([
  null,
  () => {},
]);

export default function ActiveConvoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeConvo, setActiveConvo] =
    useState<TActiveConvoContextValue | null>(null);
  return (
    <ActiveConvoContext.Provider value={[activeConvo, setActiveConvo]}>
      {children}
    </ActiveConvoContext.Provider>
  );
}
