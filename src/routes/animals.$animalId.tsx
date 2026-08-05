import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Clock, Leaf, MapPin, Utensils } from "lucide-react";
import { AppShell } from "@/components/zoo/AppShell";
import { useZoo } from "@/lib/zoo-context";
import { getAnimal, nearbyAnimals, statusTone } from "@/data/zoo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/animals/$animalId")({
  loader: ({ params }) => {
    const animal = getAnimal(params.animalId);
    if (!animal) throw notFound();
    return { animal };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Animal not found" }, { name: "robots", content: "noindex" }],
      };
    }
    const { animal } = loaderData;
    const description = `${animal.name} (${animal.scientificName}) — habitat, diet, feeding time and conservation status.`;
    return {
      meta: [
        { title: `${animal.name} — Smart Zoo Navigator` },
        { name: "description", content: description },
        { property: "og:title", content: `${animal.name} — Smart Zoo Navigator` },
        { property: "og:description", content: description },
        { property: "og:image", content: animal.image },
        { name: "twitter:image", content: animal.image },
      ],
    };
  },
  component: AnimalDetail,
});

function AnimalDetail() {
  const { animal } = Route.useLoaderData();
  const { zooId } = useZoo();
  const nearby = nearbyAnimals(zooId, animal.id);

  return (
    <AppShell>
      <div className="relative h-64 w-full">
        <img src={animal.image} alt={animal.name} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-leaf-deep/90 to-transparent" />
        <Link
          to="/animals"
          className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card/90 shadow-card"
          aria-label="Back to animals"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h1 className="text-2xl font-semibold text-primary-foreground">{animal.name}</h1>
          <p className="text-sm italic text-primary-foreground/80">{animal.scientificName}</p>
        </div>
      </div>

      <div className="space-y-4 px-4 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold",
              statusTone[animal.status],
            )}
          >
            {animal.status}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            <Clock className="h-3.5 w-3.5 text-leaf" /> Feeding {animal.feedingTime}
          </span>
        </div>

        <InfoRow icon={Leaf} label="Habitat" value={animal.habitat} />
        <InfoRow icon={Utensils} label="Diet" value={animal.diet} />
        <InfoRow icon={MapPin} label="Enclosure" value={animal.enclosure} />

        <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
          <h2 className="text-base font-semibold">Fun facts</h2>
          <ul className="mt-2 space-y-2">
            {animal.facts.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/map"
          search={{ focus: animal.id }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          <MapPin className="h-4 w-4" /> View on map
        </Link>

        <section>
          <h2 className="text-base font-semibold">Nearby animals</h2>
          <div className="mt-3 space-y-2">
            {nearby.map(({ animal: a, distance }) => (
              <Link
                key={a.id}
                to="/animals/$animalId"
                params={{ animalId: a.id }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
              >
                <img src={a.image} alt={a.name} className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.enclosure}</p>
                </div>
                <span className="shrink-0 rounded-full bg-leaf/12 px-2.5 py-1 text-xs font-semibold text-leaf">
                  {distance} m
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Leaf;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf/12 text-leaf">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}