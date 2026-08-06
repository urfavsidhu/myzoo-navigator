import { Heart } from "lucide-react";
import { useFavorites } from "@/lib/favorites-context";
import { cn } from "@/lib/utils";

export function FavoriteButton({
  animalId,
  className,
  size = "sm",
}: {
  animalId: string;
  className?: string;
  size?: "sm" | "lg";
}) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const active = isFavorite(animalId);

  return (
    <button
      type="button"
      aria-label={active ? "Remove from favorites" : "Add to favorites"}
      aria-pressed={active}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggleFavorite(animalId);
      }}
      className={cn(
        "grid place-items-center rounded-full bg-card/90 shadow-card backdrop-blur transition-transform active:scale-90",
        size === "lg" ? "h-10 w-10" : "h-8 w-8",
        className,
      )}
    >
      <Heart
        className={cn(
          size === "lg" ? "h-5 w-5" : "h-4 w-4",
          active ? "fill-destructive text-destructive" : "text-muted-foreground",
        )}
      />
    </button>
  );
}
