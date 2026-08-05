import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Search } from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { useZoo } from "@/lib/zoo-context";
import { statusTone, zooAnimals } from "@/data/zoo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/animals/")({
  head: () => ({
    meta: [
      { title: "Animal Explorer — Smart Zoo Navigator" },
      {
        name: "description",
        content: "Browse every animal in the selected Uttar Pradesh zoo with photos and facts.",
      },
      { property: "og:title", content: "Animal Explorer — Smart Zoo Navigator" },
      {
        property: "og:description",
        content: "Photos, diets, feeding times and conservation status for each animal.",
      },
    ],
  }),
  component: AnimalsPage,
});

function AnimalsPage() {
  const { zoo, zooId } = useZoo();
  const [q, setQ] = useState("");
  const list = zooAnimals(zooId).filter((a) =>
    `${a.name} ${a.scientificName}`.toLowerCase().includes(q.toLowerCase()),
  );

  return (
    <AppShell>
      <PageHeader title="Animal Explorer" subtitle={`${list.length} species · ${zoo.city}`} />
      <div className="px-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 shadow-card">
          <Search className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Filter animals"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {list.map((a) => (
            <Link
              key={a.id}
              to="/animals/$animalId"
              params={{ animalId: a.id }}
              className="overflow-hidden rounded-3xl border border-border bg-card shadow-card transition-transform active:scale-95"
            >
              <img src={a.image} alt={a.name} loading="lazy" className="h-28 w-full object-cover" />
              <div className="p-3">
                <p className="text-sm font-semibold leading-tight">{a.name}</p>
                <p className="mt-0.5 truncate text-[11px] italic text-muted-foreground">
                  {a.scientificName}
                </p>
                <span
                  className={cn(
                    "mt-2 inline-block rounded-full border px-2 py-0.5 text-[10px] font-semibold",
                    statusTone[a.status],
                  )}
                >
                  {a.status}
                </span>
              </div>
            </Link>
          ))}
        </div>
        {list.length === 0 ? (
          <p className="py-10 text-center text-sm text-muted-foreground">No animals matched.</p>
        ) : null}
      </div>
    </AppShell>
  );
}