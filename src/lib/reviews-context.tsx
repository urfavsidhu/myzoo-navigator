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

export type DbReview = {
  id: string;
  userId: string;
  animalId: string;
  rating: number;
  text: string;
  createdAt: string;
  name: string;
};

type ReviewsValue = {
  loading: boolean;
  reviewsFor: (animalId: string) => DbReview[];
  averageFor: (animalId: string) => number;
  myReviews: DbReview[];
  addReview: (r: { animalId: string; rating: number; text: string }) => Promise<void>;
  updateReview: (id: string, patch: { rating: number; text: string }) => Promise<void>;
  deleteReview: (id: string) => Promise<void>;
  refresh: () => Promise<void>;
};

const ReviewsContext = createContext<ReviewsValue | null>(null);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<DbReview[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data } = await supabase
      .from("reviews")
      .select("id, user_id, animal_id, rating, text, created_at")
      .order("created_at", { ascending: false });
    const rows = data ?? [];
    const ids = [...new Set(rows.map((r) => r.user_id))];
    let names = new Map<string, string>();
    if (ids.length) {
      const { data: profs } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", ids);
      names = new Map((profs ?? []).map((p) => [p.id, p.full_name ?? "Visitor"]));
    }
    setReviews(
      rows.map((r) => ({
        id: r.id,
        userId: r.user_id,
        animalId: r.animal_id,
        rating: r.rating,
        text: r.text,
        createdAt: r.created_at,
        name: names.get(r.user_id) ?? "Visitor",
      })),
    );
    setLoading(false);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, user?.id]);

  const value = useMemo<ReviewsValue>(() => {
    const reviewsFor = (animalId: string) => reviews.filter((r) => r.animalId === animalId);
    return {
      loading,
      reviewsFor,
      averageFor: (animalId: string) => {
        const list = reviewsFor(animalId);
        if (!list.length) return 0;
        return list.reduce((s, r) => s + r.rating, 0) / list.length;
      },
      myReviews: user ? reviews.filter((r) => r.userId === user.id) : [],
      addReview: async ({ animalId, rating, text }) => {
        if (!user) return;
        await supabase
          .from("reviews")
          .insert({ user_id: user.id, animal_id: animalId, rating, text });
        await refresh();
      },
      updateReview: async (id, patch) => {
        await supabase.from("reviews").update(patch).eq("id", id);
        await refresh();
      },
      deleteReview: async (id) => {
        await supabase.from("reviews").delete().eq("id", id);
        await refresh();
      },
      refresh,
    };
  }, [reviews, loading, user, refresh]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used inside ReviewsProvider");
  return ctx;
}