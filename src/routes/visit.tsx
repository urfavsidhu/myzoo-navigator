import { createFileRoute } from "@tanstack/react-router";
import { Clock, Info, Sparkles, Ticket, Ticket as TicketIcon, Utensils } from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { useZoo } from "@/lib/zoo-context";
import { bookingUrl, feedingSchedule, weekDays } from "@/data/zoo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Tickets & Timings — Smart Zoo Navigator" },
      {
        name: "description",
        content:
          "Ticket prices, opening hours, closed days, feeding schedule and animal show timings for zoos in Uttar Pradesh.",
      },
      { property: "og:title", content: "Tickets & Timings — Smart Zoo Navigator" },
      {
        property: "og:description",
        content: "Plan your zoo visit with ticket prices, feeding times and show timings.",
      },
    ],
  }),
  component: VisitPage,
});

function VisitPage() {
  const { zoo, zooId } = useZoo();
  const feeds = feedingSchedule(zooId);
  const closed = zoo.closedOn.replace(/s$/, "").slice(0, 3);

  const tickets = [
    { label: "Adult", value: zoo.tickets.adult, note: "12 years and above" },
    { label: "Child", value: zoo.tickets.child, note: "3 – 11 years" },
    { label: "Student", value: zoo.tickets.student, note: "With valid ID card" },
    { label: "Foreign Tourist", value: zoo.tickets.foreign, note: "Passport required" },
  ];

  return (
    <AppShell>
      <PageHeader title="Tickets & Timings" subtitle={`${zoo.name}, ${zoo.city}`} />
      <div className="space-y-5 px-4">
        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <TicketIcon className="h-4 w-4 text-leaf" /> Entry tickets
          </h2>
          <div className="mt-2 grid grid-cols-2 gap-3">
            {tickets.map((t) => (
              <div
                key={t.label}
                className="rounded-3xl border border-border bg-card p-4 shadow-card"
              >
                <p className="text-xs font-semibold uppercase text-muted-foreground">{t.label}</p>
                <p className="mt-1 text-xl font-semibold text-leaf-deep">{t.value}</p>
                <p className="mt-1 text-[11px] text-muted-foreground">{t.note}</p>
              </div>
            ))}
          </div>
          <a
            href={bookingUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
          >
            <Ticket className="h-4 w-4" /> Book online
          </a>
        </section>

        <section className="rounded-3xl border border-border bg-card p-4 shadow-card">
          <p className="flex items-center gap-2 text-sm font-semibold">
            <Clock className="h-4 w-4 text-leaf" /> {zoo.hours}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Last entry 45 minutes before closing · Closed on {zoo.closedOn}
          </p>
          <div className="mt-3 grid grid-cols-7 gap-1.5">
            {weekDays.map((d) => {
              const isClosed = d === closed;
              return (
                <span
                  key={d}
                  className={cn(
                    "rounded-xl border py-1.5 text-center text-[11px] font-semibold",
                    isClosed
                      ? "border-destructive/40 bg-destructive/10 text-destructive"
                      : "border-border bg-secondary/60 text-muted-foreground",
                  )}
                >
                  {d}
                </span>
              );
            })}
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Utensils className="h-4 w-4 text-leaf" /> Feeding schedule
          </h2>
          <div className="mt-2 overflow-hidden rounded-3xl border border-border bg-card shadow-card">
            {feeds.map((a, i) => (
              <div
                key={a.id}
                className={cn(
                  "grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 py-3",
                  i > 0 && "border-t border-border/70",
                )}
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium">{a.name}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{a.enclosure}</p>
                </div>
                <span className="shrink-0 rounded-full bg-leaf/12 px-2.5 py-1 text-xs font-semibold text-leaf">
                  {a.feedingTime}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            <Sparkles className="h-4 w-4 text-leaf" /> Animal show timings
          </h2>
          <div className="mt-2 space-y-2">
            {zoo.shows.map((s) => (
              <div
                key={s.id}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-3xl border border-border bg-card p-4 shadow-card"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{s.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{s.venue}</p>
                </div>
                <span className="shrink-0 rounded-full bg-sun/25 px-3 py-1 text-xs font-semibold text-clay">
                  {s.time}
                </span>
              </div>
            ))}
          </div>
        </section>

        <section className="flex gap-3 rounded-3xl border border-border bg-card p-4 shadow-card">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf/12 text-leaf">
            <Info className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase text-muted-foreground">Good to know</p>
            <p className="text-sm font-semibold">{zoo.blurb}</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Plastic bottles, feeding animals and drones are not allowed.
            </p>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
