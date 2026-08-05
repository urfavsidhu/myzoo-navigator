import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Search as SearchIcon } from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { facilityIcon } from "@/components/zoo/ZooMap";
import { useZoo } from "@/lib/zoo-context";
import { facilities, zooAnimals } from "@/data/zoo-data";

export const Route = createFileRoute("/search")({
  validateSearch: (search: Record<string, unknown>) => ({
    q: typeof search["q"] === "string" ? (search["q"] as string) : "",
  }),
  head: () => ({
    meta: [
      { title: "Search the Zoo — Smart Zoo Navigator" },
      {
        name: "description",
        content: "Search animals, enclosures, washrooms, food courts and gates inside the zoo.",
      },
      { property: "og:title", content: "Search the Zoo — Smart Zoo Navigator" },
      {
        property: "og:description",
        content: "One search box for every animal and facility in the zoo.",
      },
    ],
  }),
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const navigate = useNavigate({ from: "/search" });
  const { zooId } = useZoo();
  const term = q.trim().toLowerCase();

  const animalHits = zooAnimals(zooId).filter((a) =>
    `${a.name} ${a.scientificName} ${a.enclosure}`.toLowerCase().includes(term),
  );
  const facilityHits = facilities.filter((f) =>
    `${f.name} ${f.kind} ${f.description}`.toLowerCase().includes(term),
  );

  return (
    <AppShell>
      <PageHeader title="Smart Search" subtitle="Animals, enclosures and facilities" />
      <div className="px-4">
        <div className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 shadow-card">
          <SearchIcon className="h-4 w-4 shrink-0 text-muted-foreground" />
          <input
            autoFocus
            value={q}
            onChange={(e) => navigate({ search: { q: e.target.value } })}
            placeholder="Try 'tiger', 'washroom', 'exit'"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </div>

        {term ? (
          <div className="mt-4 space-y-2">
            {animalHits.map((a) => (
              <Link
                key={a.id}
                to="/animals/$animalId"
                params={{ animalId: a.id }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf/12 text-lg">
                  {a.emoji}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{a.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{a.enclosure}</p>
                </div>
                <span className="shrink-0 text-[10px] font-semibold text-leaf uppercase">
                  Animal
                </span>
              </Link>
            ))}
            {facilityHits.map((f) => {
              const Icon = facilityIcon[f.kind];
              return (
                <Link
                  key={f.id}
                  to="/map"
                  search={{ focus: f.id }}
                  className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-sand text-bark">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold">{f.name}</p>
                    <p className="truncate text-xs text-muted-foreground">{f.description}</p>
                  </div>
                  <span className="shrink-0 text-[10px] font-semibold text-clay uppercase">
                    Facility
                  </span>
                </Link>
              );
            })}
            {animalHits.length + facilityHits.length === 0 ? (
              <p className="py-10 text-center text-sm text-muted-foreground">
                Nothing found for “{q}”.
              </p>
            ) : null}
          </div>
        ) : (
          <p className="py-10 text-center text-sm text-muted-foreground">
            Start typing to search animals and facilities.
          </p>
        )}
      </div>
    </AppShell>
  );
}