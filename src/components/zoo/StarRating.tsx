import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

export function StarRating({
  value,
  size = "sm",
  onChange,
}: {
  value: number;
  size?: "sm" | "lg";
  onChange?: (v: number) => void;
}) {
  const px = size === "lg" ? "h-6 w-6" : "h-4 w-4";
  return (
    <span className="inline-flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((n) => {
        const filled = value >= n - 0.25;
        const star = (
          <Star
            className={cn(px, filled ? "fill-sun text-sun" : "text-muted-foreground/50")}
          />
        );
        return onChange ? (
          <button
            key={n}
            type="button"
            aria-label={`${n} star`}
            onClick={() => onChange(n)}
            className="transition-transform active:scale-90"
          >
            {star}
          </button>
        ) : (
          <span key={n}>{star}</span>
        );
      })}
    </span>
  );
}