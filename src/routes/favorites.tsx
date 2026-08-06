import { createFileRoute, Link } from "@tanstack/react-router";
import { HeartOff } from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { FavoriteButton } from "@/components/zoo/FavoriteButton";
import { useFavorites } from "@/lib/favorites-context";
import { useZoo } from "@/lib/zoo-context";
import { statusTone, zooAnimals } from "@/data/zoo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/favorites")({
  head: () => ({
    meta: [
      { title: "My Favorites — Smart Zoo Navigator" },
      {
        name: "description",
        content: "Your shortlist of favorite animals to visit on this trip to the zoo.",
      },
      { property: "og:title", content: "My Favorites — Smart Zoo Navigator" },
      {
        property: "og:description",
        content: "Keep track of the animals you want to see first.",
      },
    ],
  }),
  component: FavoritesPage,
});

function FavoritesPage() {
  const { zooId, zoo } = useZoo();
  const { favorites } = useFavorites();
  const list = zooAnimals(zooId).filter((a) => favorites.includes(a.id));

  return (
    <AppShell>
      <PageHeader title="My Favorites" subtitle={`${list.length} saved · ${zoo.city}`} />
      <div className="px-4">
        {list.length === 0 ? (
          <div className="rounded-3xl border border-dashed border-border bg-card/60 p-8 text-center">
            <HeartOff className="mx-auto h-8 w-8 text-muted-foreground" />
            <p className="mt-3 text-sm font-semibold">No favorites yet</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Tap the heart on any animal to save it here for your visit.
            </p>
            <Link
              to="/animals"
              className="mt-4 inline-flex rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Browse animals
            </Link>
          </div>
        ) : (
          <div className="space-y-2">
            {list.map((a) => (
              <div key={a.id} className="relative">
                <Link
                  to="/animals/$animalId"
                  params={{ animalId: a.id }}
                  className="flex items-center gap-3 rounded-3xl border border-border bg-card p-3 pr-14 shadow-card"
                >
                  <img src={a.image} alt={a.name} className="h-14 w-14 rounded-2xl object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{a.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{a.enclosure}</p>
                    <span
                      className={cn(
                        "mt-1 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                        statusTone[a.status],
                      )}
                    >
                      {a.status}
                    </span>
                  </div>
                </Link>
                <FavoriteButton animalId={a.id} className="absolute right-3 top-1/2 -translate-y-1/2" />
              </div>
            ))}
          </div>
        )}
      </div>
    </AppShell>
  );
}
