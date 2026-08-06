import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Accessibility,
  CarFront,
  DoorOpen,
  GlassWater,
  HeartPulse,
  Navigation,
  Toilet,
  UtensilsCrossed,
} from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { useZoo } from "@/lib/zoo-context";
import {
  buildDirections,
  facilities,
  facilityLabels,
  facilityOrder,
  youAreHere,
  distanceFrom,
  type FacilityKind,
} from "@/data/zoo-data";

const icons: Record<FacilityKind, typeof Toilet> = {
  gate: DoorOpen,
  restroom: Toilet,
  food: UtensilsCrossed,
  water: GlassWater,
  firstaid: HeartPulse,
  parking: CarFront,
  accessible: Accessibility,
};

export const Route = createFileRoute("/facilities")({
  head: () => ({
    meta: [
      { title: "Facility Finder — Smart Zoo Navigator" },
      {
        name: "description",
        content:
          "Find washrooms, food courts, drinking water, first aid, parking and exits with walking distance from your location.",
      },
      { property: "og:title", content: "Facility Finder — Smart Zoo Navigator" },
      {
        property: "og:description",
        content: "Every zoo facility grouped by type, with distance and one-tap navigation.",
      },
    ],
  }),
  component: FacilitiesPage,
});

function FacilitiesPage() {
  const { zoo } = useZoo();

  return (
    <AppShell>
      <PageHeader
        title="Facility Finder"
        subtitle={`${facilities.length} facilities · ${zoo.city}`}
      />
      <div className="space-y-5 px-4">
        {facilityOrder.map((kind) => {
          const items = facilities
            .filter((f) => f.kind === kind)
            .map((f) => ({ facility: f, directions: buildDirections({ ...f, name: f.name }) }))
            .sort((a, b) => a.directions.distance - b.directions.distance);
          if (items.length === 0) return null;
          const Icon = icons[kind];

          return (
            <section key={kind}>
              <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                <Icon className="h-4 w-4 text-leaf" />
                {facilityLabels[kind]}
              </h2>
              <div className="mt-2 space-y-2">
                {items.map(({ facility, directions }) => (
                  <div
                    key={facility.id}
                    className="rounded-3xl border border-border bg-card p-4 shadow-card"
                  >
                    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold">{facility.name}</p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          {facility.description}
                        </p>
                      </div>
                      <span className="shrink-0 rounded-full bg-leaf/12 px-2.5 py-1 text-xs font-semibold text-leaf">
                        {distanceFrom(youAreHere, facility)} m
                      </span>
                    </div>
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs text-muted-foreground">
                        about {directions.minutes} min walk from you
                      </p>
                      <Link
                        to="/map"
                        search={{ focus: facility.id }}
                        className="inline-flex items-center gap-1.5 rounded-full bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground transition-transform active:scale-95"
                      >
                        <Navigation className="h-3.5 w-3.5" /> Navigate
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </AppShell>
  );
}
