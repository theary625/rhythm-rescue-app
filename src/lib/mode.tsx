import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type AppMode = "code" | "study";

const ModeCtx = createContext<{ mode: AppMode; setMode: (m: AppMode) => void }>({
  mode: "code",
  setMode: () => {},
});

export function ModeProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<AppMode>("code");
  useEffect(() => {
    const saved = typeof window !== "undefined" ? localStorage.getItem("acls-mode") : null;
    if (saved === "code" || saved === "study") setMode(saved);
  }, []);
  useEffect(() => {
    if (typeof window !== "undefined") localStorage.setItem("acls-mode", mode);
  }, [mode]);
  return <ModeCtx.Provider value={{ mode, setMode }}>{children}</ModeCtx.Provider>;
}

export const useMode = () => useContext(ModeCtx);
