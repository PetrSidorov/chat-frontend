import { ReactNode, createContext, useState } from "react";
import { TActiveConvoContext, TActiveConvoContextValue } from "../types";

export const ActiveConvoContext = createContext<TActiveConvoContext>({
  convoContext: [null, () => {}],
  offsetContext: [0, () => {}],
  offsetLoading: [false, () => {}],
});

export default function ActiveConvoProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [activeConvo, setActiveConvo] =
    useState<TActiveConvoContextValue | null>(null);
  const [offset, setOffset] = useState<number>(2);
  const [offsetLoading, setOffsetLoading] = useState<boolean>(false);
  return (
    <ActiveConvoContext.Provider
      value={{
        convoContext: [activeConvo, setActiveConvo],
        offsetContext: [offset, setOffset],
        offsetLoading: [offsetLoading, setOffsetLoading],
      }}
    >
      {children}
    </ActiveConvoContext.Provider>
  );
}
