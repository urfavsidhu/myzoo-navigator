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

/** Every write returns this so the UI can show a message instead of failing silently. */
export type ReviewActionResult = { error: string | null };

type ReviewsValue = {
  loading: boolean;
  reviewsFor: (animalId: string) => DbReview[];
  averageFor: (animalId: string) => number;
  myReviews: DbReview[];
  addReview: (r: { animalId: string; rating: number; text: string }) => Promise<ReviewActionResult>;
  updateReview: (
    id: string,
    patch: { rating: number; text: string },
  ) => Promise<ReviewActionResult>;
  deleteReview: (id: string) => Promise<ReviewActionResult>;
  refresh: () => Promise<void>;
};

const ReviewsContext = createContext<ReviewsValue | null>(null);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [reviews, setReviews] = useState<DbReview[]>([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    const { data, error } = await supabase
      .from("reviews")
      .select("id, user_id, animal_id, rating, text, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      // Keep whatever we already have on screen instead of wiping it.
      console.error("Could not load reviews:", error.message);
      setLoading(false);
      return;
    }

    const rows = data ?? [];
    const ids = [...new Set(rows.map((r) => r.user_id))];
    let names = new Map<string, string>();
    if (ids.length) {
      const { data: profs, error: profError } = await supabase
        .from("profiles")
        .select("id, full_name")
        .in("id", ids);
      if (profError) console.error("Could not load reviewer names:", profError.message);
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
        if (!user) return { error: "Please log in to write a review." };
        const { error } = await supabase
          .from("reviews")
          .insert({ user_id: user.id, animal_id: animalId, rating, text });
        if (error) return { error: error.message };
        await refresh();
        return { error: null };
      },
      updateReview: async (id, patch) => {
        // .select() lets us notice when the row-level policy silently matched nothing.
        const { data, error } = await supabase
          .from("reviews")
          .update(patch)
          .eq("id", id)
          .select("id");
        if (error) return { error: error.message };
        if (!data?.length) return { error: "Could not update this review." };
        await refresh();
        return { error: null };
      },
      deleteReview: async (id) => {
        const { data, error } = await supabase
          .from("reviews")
          .delete()
          .eq("id", id)
          .select("id");
        if (error) return { error: error.message };
        if (!data?.length) return { error: "Could not delete this review." };
        await refresh();
        return { error: null };
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
