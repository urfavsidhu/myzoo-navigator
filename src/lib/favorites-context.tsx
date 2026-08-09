import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";

type FavoritesContextValue = {
  favorites: string[];
  isFavorite: (id: string) => boolean;
  toggleFavorite: (id: string) => void;
};

const FavoritesContext = createContext<FavoritesContextValue | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    if (!user) {
      setFavorites([]);
      return;
    }
    void (async () => {
      const { data } = await supabase
        .from("favorites")
        .select("animal_id")
        .eq("user_id", user.id);
      setFavorites((data ?? []).map((row) => row.animal_id as string));
    })();
  }, [user]);

  const toggleFavorite = useCallback(
    (id: string) => {
      const wasFavorite = favorites.includes(id);
      setFavorites((prev) => (wasFavorite ? prev.filter((f) => f !== id) : [...prev, id]));
      if (!user) return;
      void (async () => {
        if (wasFavorite) {
          await supabase.from("favorites").delete().eq("user_id", user.id).eq("animal_id", id);
        } else {
          await supabase.from("favorites").insert({ user_id: user.id, animal_id: id });
        }
      })();
    },
    [user, favorites],
  );

  const value = useMemo(
    () => ({ favorites, isFavorite: (id: string) => favorites.includes(id), toggleFavorite }),
    [favorites, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}
