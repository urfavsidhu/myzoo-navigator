import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Camera, Footprints, Navigation, X } from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { buildDirections, photoSpots, type PhotoSpot } from "@/data/zoo-data";
import { useAppPrefs } from "@/lib/app-context";

export const Route = createFileRoute("/photo-spots")({
  head: () => ({
    meta: [
      { title: "Best Photo Spots — Smart Zoo Navigator" },
      {
        name: "description",
        content: "Five of the best selfie and photo spots inside the zoo, with walking directions.",
      },
      { property: "og:title", content: "Best Photo Spots — Smart Zoo Navigator" },
      {
        property: "og:description",
        content: "Banyan arches, lake decks and glass walls — where to take the best pictures.",
      },
    ],
  }),
  component: PhotoSpotsPage,
});

function PhotoSpotsPage() {
  const { t, lang } = useAppPrefs();
  const [active, setActive] = useState<PhotoSpot | null>(null);
  const directions = active
    ? buildDirections({ x: active.x, y: active.y, name: active.name })
    : null;

  return (
    <AppShell>
      <PageHeader
        title={t("page.photos")}
        subtitle={
          lang === "hi" ? "सबसे अच्छी सेल्फी जगहें" : `${photoSpots.length} best selfie spots`
        }
      />
      <div className="space-y-3 px-4 pb-8">
        {photoSpots.map((s) => (
          <article
            key={s.id}
            className="overflow-hidden rounded-3xl border border-border bg-card shadow-card"
          >
            <img
              src={s.image}
              alt={s.name}
              loading="lazy"
              className="h-40 w-full object-cover"
            />
            <div className="space-y-2 p-4">
              <h2 className="flex items-center gap-2 text-base font-semibold">
                <Camera className="h-4 w-4 text-leaf" />
                {lang === "hi" ? s.nameHi : s.name}
              </h2>
              <p className="text-sm text-muted-foreground">{s.caption}</p>
              <button
                onClick={() => setActive(s)}
                className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
              >
                <Navigation className="h-4 w-4" /> {t("btn.navigate")}
              </button>
            </div>
          </article>
        ))}
      </div>

      {active && directions ? (
        <div className="fixed inset-x-0 bottom-16 z-30 mx-auto max-w-2xl px-4">
          <div className="rounded-3xl border border-border bg-card p-4 shadow-float">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <p className="truncate text-base font-semibold">
                {lang === "hi" ? active.nameHi : active.name}
              </p>
              <button
                aria-label="Close"
                onClick={() => setActive(null)}
                className="rounded-full bg-secondary p-1.5 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-2 flex items-center gap-2 text-sm font-semibold text-leaf">
              <Footprints className="h-4 w-4" />
              {directions.distance} m · {directions.minutes} min
            </p>
            <ol className="mt-2 space-y-1.5">
              {directions.steps.map((step, i) => (
                <li key={step} className="flex gap-2 text-sm text-muted-foreground">
                  <span className="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-leaf/15 text-[10px] font-bold text-leaf">
                    {i + 1}
                  </span>
                  {step}
                </li>
              ))}
            </ol>
            <Link
              to="/map"
              className="mt-3 block rounded-full border border-border bg-secondary px-4 py-2.5 text-center text-sm font-semibold"
            >
              {t("btn.viewOnMap")}
            </Link>
          </div>
        </div>
      ) : null}
    </AppShell>
  );
}