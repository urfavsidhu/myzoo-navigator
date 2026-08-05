import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { getZoo, zoos } from "@/data/zoo-data";

type ZooContextValue = {
  zooId: string;
  setZooId: (id: string) => void;
  zoo: ReturnType<typeof getZoo>;
};

const ZooContext = createContext<ZooContextValue | null>(null);

export function ZooProvider({ children }: { children: ReactNode }) {
  const [zooId, setZooId] = useState(zoos[0]!.id);
  const value = useMemo(() => ({ zooId, setZooId, zoo: getZoo(zooId) }), [zooId]);
  return <ZooContext.Provider value={value}>{children}</ZooContext.Provider>;
}

export function useZoo() {
  const ctx = useContext(ZooContext);
  if (!ctx) throw new Error("useZoo must be used inside ZooProvider");
  return ctx;
}