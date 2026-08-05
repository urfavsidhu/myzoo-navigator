import { createFileRoute } from "@tanstack/react-router";
import { Clock, Info, Ticket } from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { useZoo } from "@/lib/zoo-context";

export const Route = createFileRoute("/visit")({
  head: () => ({
    meta: [
      { title: "Tickets & Timings — Smart Zoo Navigator" },
      {
        name: "description",
        content: "Entry fees, opening hours and weekly closing days for zoos in Uttar Pradesh.",
      },
      { property: "og:title", content: "Tickets & Timings — Smart Zoo Navigator" },
      {
        property: "og:description",
        content: "Plan your zoo visit with ticket prices and opening hours.",
      },
    ],
  }),
  component: VisitPage,
});

function VisitPage() {
  const { zoo } = useZoo();

  return (
    <AppShell>
      <PageHeader title="Tickets & Timings" subtitle={`${zoo.name}, ${zoo.city}`} />
      <div className="space-y-3 px-4">
        <Card icon={Ticket} title="Entry ticket" value={zoo.ticket} note="Buy at the main gate counters or online." />
        <Card icon={Clock} title="Opening hours" value={zoo.hours} note={`Closed on ${zoo.closedOn}. Last entry 45 minutes before closing.`} />
        <Card icon={Info} title="Good to know" value={zoo.blurb} note="Plastic bottles, feeding animals and drones are not allowed." />
      </div>
    </AppShell>
  );
}

function Card({
  icon: Icon,
  title,
  value,
  note,
}: {
  icon: typeof Ticket;
  title: string;
  value: string;
  note: string;
}) {
  return (
    <div className="flex gap-3 rounded-3xl border border-border bg-card p-4 shadow-card">
      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-leaf/12 text-leaf">
        <Icon className="h-5 w-5" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase">{title}</p>
        <p className="text-sm font-semibold">{value}</p>
        <p className="mt-1 text-xs text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}