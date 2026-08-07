import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Download, Footprints, Navigation, X } from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { ZooMap, type MapPoint } from "@/components/zoo/ZooMap";
import { useZoo } from "@/lib/zoo-context";
import { buildDirections, facilities, getAnimal, zooAnimals } from "@/data/zoo-data";
import { CrowdBadge } from "@/components/zoo/CrowdBadge";

export const Route = createFileRoute("/map")({
  validateSearch: (search: Record<string, unknown>) => ({
    focus: typeof search["focus"] === "string" ? (search["focus"] as string) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Zoo Map & Directions — Smart Zoo Navigator" },
      {
        name: "description",
        content: "Interactive zoo map with enclosures, restrooms, food courts and walking routes.",
      },
      { property: "og:title", content: "Zoo Map & Directions — Smart Zoo Navigator" },
      {
        property: "og:description",
        content: "Tap any marker for directions inside the zoo.",
      },
    ],
  }),
  component: MapPage,
});

function MapPage() {
  const { zoo, zooId } = useZoo();
  const { focus } = Route.useSearch();
  const [selected, setSelected] = useState<MapPoint | null>(null);
  const [directions, setDirections] = useState<ReturnType<typeof buildDirections> | null>(null);
  const [offlineProgress, setOfflineProgress] = useState<number | null>(null);
  const [offlineReady, setOfflineReady] = useState(false);

  useEffect(() => {
    if (!focus) return;
    const animal = getAnimal(focus);
    if (animal) {
      setSelected({ type: "animal", data: animal });
      return;
    }
    const facility = facilities.find((f) => f.id === focus);
    if (facility) setSelected({ type: "facility", data: facility });
  }, [focus]);

  const point = selected?.data;

  const downloadOffline = () => {
    if (offlineReady || offlineProgress !== null) return;
    setOfflineProgress(0);
    const timer = setInterval(() => {
      setOfflineProgress((p) => {
        const next = (p ?? 0) + 5;
        if (next >= 100) {
          clearInterval(timer);
          setOfflineReady(true);
          setTimeout(() => setOfflineProgress(null), 400);
          return 100;
        }
        return next;
      });
    }, 100);
  };

  return (
    <AppShell>
      <PageHeader title="Zoo Map" subtitle={`${zoo.name}, ${zoo.city}`} />
      {offlineReady ? (
        <div className="mx-4 mb-3 flex items-center gap-2 rounded-2xl border border-leaf/30 bg-leaf/10 px-3 py-2 text-xs font-semibold text-leaf-deep">
          <CheckCircle2 className="h-4 w-4 text-leaf" /> Offline map ready
        </div>
      ) : null}
      <div className="px-4">
        <ZooMap
          animals={zooAnimals(zooId)}
          facilities={facilities}
          selectedId={point?.id}
          onSelect={(p) => {
            setSelected(p);
            setDirections(null);
          }}
        />
        <p className="mt-3 text-center text-xs text-muted-foreground">
          Tap a marker for details · use + / − to zoom
        </p>

        {!offlineReady ? (
          <div className="mt-3">
            <button
              onClick={downloadOffline}
              disabled={offlineProgress !== null}
              className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold shadow-card transition-transform active:scale-95 disabled:opacity-70"
            >
              <Download className="h-4 w-4 text-leaf" />
              {offlineProgress !== null ? "Downloading map…" : "Download map for offline use"}
            </button>
            {offlineProgress !== null ? (
              <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-leaf transition-all duration-100"
                  style={{ width: `${offlineProgress}%` }}
                />
              </div>
            ) : null}
          </div>
        ) : null}
      </div>

      {selected ? (
        <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-2xl px-4">
          <div className="rounded-3xl border border-border bg-card p-4 shadow-float">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <p className="truncate text-base font-semibold">{selected.data.name}</p>
                {selected.type === "animal" && selected.data.crowdLevel ? (
                  <CrowdBadge level={selected.data.crowdLevel} className="mt-1" />
                ) : null}
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {selected.type === "animal"
                    ? selected.data.enclosure
                    : selected.data.description}
                </p>
              </div>
              <button
                aria-label="Close"
                onClick={() => {
                  setSelected(null);
                  setDirections(null);
                }}
                className="rounded-full bg-secondary p-1.5 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {directions ? (
              <div className="mt-3 rounded-2xl bg-secondary/70 p-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-leaf-deep">
                  <Footprints className="h-4 w-4" />
                  {directions.distance} m · about {directions.minutes} min walk
                </p>
                <ol className="mt-2 space-y-1.5">
                  {directions.steps.map((step, i) => (
                    <li key={step} className="flex gap-2 text-xs text-foreground">
                      <span className="mt-0.5 grid h-4 w-4 shrink-0 place-items-center rounded-full bg-leaf/15 text-[10px] font-semibold text-leaf">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>
            ) : null}

            <div className="mt-3 flex gap-2">
              <button
                onClick={() =>
                  setDirections(
                    buildDirections({
                      x: selected.data.x,
                      y: selected.data.y,
                      name: selected.data.name,
                    }),
                  )
                }
                className="flex-1 inline-flex items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
              >
                <Navigation className="h-4 w-4" />
                {directions ? "Recalculate" : "Navigate"}
              </button>
              {selected.type === "animal" ? (
                <Link
                  to="/animals/$animalId"
                  params={{ animalId: selected.data.id }}
                  className="inline-flex items-center rounded-full border border-border px-4 py-2.5 text-sm font-semibold"
                >
                  Details
                </Link>
              ) : null}
            </div>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}