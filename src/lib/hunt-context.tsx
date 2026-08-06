import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { huntAnimalIds } from "@/data/zoo-data";

type HuntValue = {
  huntIds: string[];
  found: string[];
  isInHunt: (id: string) => boolean;
  isFound: (id: string) => boolean;
  markFound: (id: string) => void;
  reset: () => void;
  complete: boolean;
};

const HuntContext = createContext<HuntValue | null>(null);

export function HuntProvider({ children }: { children: ReactNode }) {
  const [found, setFound] = useState<string[]>([]);

  const markFound = useCallback((id: string) => {
    if (!huntAnimalIds.includes(id)) return;
    setFound((prev) => (prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id]));
  }, []);

  const value = useMemo(
    () => ({
      huntIds: huntAnimalIds,
      found,
      isInHunt: (id: string) => huntAnimalIds.includes(id),
      isFound: (id: string) => found.includes(id),
      markFound,
      reset: () => setFound([]),
      complete: found.length === huntAnimalIds.length,
    }),
    [found, markFound],
  );

  return <HuntContext.Provider value={value}>{children}</HuntContext.Provider>;
}

export function useHunt() {
  const ctx = useContext(HuntContext);
  if (!ctx) throw new Error("useHunt must be used inside HuntProvider");
  return ctx;
}