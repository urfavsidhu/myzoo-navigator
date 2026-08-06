import { createFileRoute, Link } from "@tanstack/react-router";
import { Award, Check, RotateCcw } from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { huntAnimals } from "@/data/zoo-data";
import { useAppPrefs } from "@/lib/app-context";
import { useHunt } from "@/lib/hunt-context";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/hunt")({
  head: () => ({
    meta: [
      { title: "Zoo Treasure Hunt — Smart Zoo Navigator" },
      {
        name: "description",
        content: "Find five animals around the zoo, tick them off and earn an explorer badge.",
      },
      { property: "og:title", content: "Zoo Treasure Hunt — Smart Zoo Navigator" },
      {
        property: "og:description",
        content: "A five-animal checklist that turns your zoo walk into a game.",
      },
    ],
  }),
  component: HuntPage,
});

function HuntPage() {
  const { t, lang } = useAppPrefs();
  const { found, markFound, complete, reset, huntIds } = useHunt();
  const list = huntAnimals();

  return (
    <AppShell>
      <PageHeader
        title={t("page.hunt")}
        subtitle={`${found.length} / ${huntIds.length} ${lang === "hi" ? "मिले" : "found"}`}
      />
      <div className="space-y-4 px-4 pb-8">
        {complete ? (
          <div className="rounded-3xl border-2 border-sun bg-sun/15 p-6 text-center shadow-float">
            <Award className="mx-auto h-14 w-14 text-sun" />
            <h2 className="mt-2 font-display text-2xl font-semibold text-clay">
              {t("label.badge")}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {lang === "hi"
                ? "आपने सभी पाँच जानवर खोज लिए — शाबाश!"
                : "You found all five animals — brilliant exploring!"}
            </p>
            <button
              onClick={reset}
              className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              <RotateCcw className="h-4 w-4" /> {lang === "hi" ? "फिर से शुरू करें" : "Start again"}
            </button>
          </div>
        ) : (
          <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
            <p className="text-sm text-muted-foreground">
              {lang === "hi"
                ? "इन पाँच जानवरों को चिड़ियाघर में ढूँढ़ें और यहाँ चिह्नित करें।"
                : "Spot these five animals around the zoo and tick them off here."}
            </p>
            <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-secondary">
              <div
                className="h-full rounded-full bg-leaf transition-all"
                style={{ width: `${(found.length / huntIds.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          {list.map((a) => {
            const isFound = found.includes(a.id);
            return (
              <div
                key={a.id}
                className={cn(
                  "flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card",
                  isFound && "border-leaf/50 bg-leaf/8",
                )}
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-secondary text-xl">
                  {a.emoji}
                </span>
                <Link
                  to="/animals/$animalId"
                  params={{ animalId: a.id }}
                  className="min-w-0 flex-1"
                >
                  <p className="truncate text-sm font-semibold">
                    {lang === "hi" && a.nameHi ? a.nameHi : a.name}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">{a.enclosure}</p>
                </Link>
                <button
                  onClick={() => markFound(a.id)}
                  className={cn(
                    "shrink-0 rounded-full px-3 py-2 text-xs font-semibold transition-transform active:scale-95",
                    isFound
                      ? "bg-leaf text-primary-foreground"
                      : "border border-border bg-secondary text-foreground",
                  )}
                >
                  {isFound ? (
                    <span className="inline-flex items-center gap-1">
                      <Check className="h-3.5 w-3.5" /> {t("btn.found")}
                    </span>
                  ) : (
                    t("btn.markFound")
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </AppShell>
  );
}