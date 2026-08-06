import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import { seedReviews, type Review } from "@/data/zoo-data";

type ReviewsValue = {
  reviewsFor: (animalId: string) => Review[];
  averageFor: (animalId: string) => number;
  addReview: (r: Omit<Review, "id">) => void;
};

const ReviewsContext = createContext<ReviewsValue | null>(null);

export function ReviewsProvider({ children }: { children: ReactNode }) {
  const [reviews, setReviews] = useState<Review[]>(seedReviews);

  const addReview = useCallback((r: Omit<Review, "id">) => {
    setReviews((prev) => [{ ...r, id: `r-${Date.now()}` }, ...prev]);
  }, []);

  const value = useMemo(() => {
    const reviewsFor = (animalId: string) => reviews.filter((r) => r.animalId === animalId);
    return {
      reviewsFor,
      averageFor: (animalId: string) => {
        const list = reviewsFor(animalId);
        if (!list.length) return 0;
        return list.reduce((s, r) => s + r.rating, 0) / list.length;
      },
      addReview,
    };
  }, [reviews, addReview]);

  return <ReviewsContext.Provider value={value}>{children}</ReviewsContext.Provider>;
}

export function useReviews() {
  const ctx = useContext(ReviewsContext);
  if (!ctx) throw new Error("useReviews must be used inside ReviewsProvider");
  return ctx;
}