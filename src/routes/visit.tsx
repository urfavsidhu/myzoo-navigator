import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, Info, Sparkles, Ticket as TicketIcon, Utensils } from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { useZoo } from "@/lib/zoo-context";
import { useAuth } from "@/lib/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { feedingSchedule, weekDays, type Tickets } from "@/data/zoo-data";
import { cn } from "@/lib/utils";

const TICKET_TYPES: Array<{ key: keyof Tickets; label: string }> = [
  { key: "adult", label: "Adult" },
  { key: "child", label: "Child" },
  { key: "student", label: "Student" },
  { key: "foreign", label: "Foreign Tourist" },
];

/** "₹60" -> 60 */
const priceNumber = (value: string) => Number(value.replace(/[^0-9.]/g, "")) || 0;

const todayISO = () => new Date().toISOString().slice(0, 10);

const refCode = () =>
  `ZOO-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Date.now().toString().slice(-4)}`;

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
        </section>

        <BookingForm />

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

function BookingForm() {
  const { zoo, zooId } = useZoo();
  const { user } = useAuth();
  const [date, setDate] = useState(todayISO());
  const [type, setType] = useState<keyof Tickets>("adult");
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const [confirmed, setConfirmed] = useState<{
    zooName: string;
    date: string;
    type: string;
    qty: number;
    total: number;
    code: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const unitPrice = priceNumber(zoo.tickets[type]);
  const total = unitPrice * qty;
  const typeLabel = TICKET_TYPES.find((t) => t.key === type)?.label ?? "Adult";

  if (!user) {
    return (
      <section className="rounded-3xl border border-border bg-card p-4 shadow-card">
        <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
          <TicketIcon className="h-4 w-4 text-leaf" /> Book tickets
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Log in to book tickets online — they'll be saved to your profile.
        </p>
        <Link
          to="/login"
          className="mt-3 flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
        >
          Log in to book
        </Link>
      </section>
    );
  }

  if (confirmed) {
    return (
      <section className="rounded-3xl border border-leaf/40 bg-leaf/10 p-4 shadow-card">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-leaf-deep">
          Ticket confirmed
        </h2>
        <div className="mt-2 rounded-2xl border border-dashed border-leaf/50 bg-card p-4">
          <p className="text-base font-semibold">{confirmed.zooName}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {confirmed.date} · {confirmed.type} × {confirmed.qty}
          </p>
          <p className="mt-2 text-lg font-semibold text-leaf-deep">₹{confirmed.total}</p>
          <p className="mt-2 font-mono text-xs text-muted-foreground">Ref: {confirmed.code}</p>
        </div>
        <p className="mt-2 text-xs text-muted-foreground">
          This ticket is only valid on {confirmed.date}. Find it anytime under My Tickets on your
          profile.
        </p>
        <button
          onClick={() => setConfirmed(null)}
          className="mt-3 w-full rounded-full border border-border px-4 py-2.5 text-sm font-semibold"
        >
          Book another
        </button>
      </section>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const code = refCode();
    const { error: insertError } = await supabase.from("tickets").insert({
      user_id: user.id,
      zoo_id: zooId,
      visit_date: date,
      ticket_type: typeLabel,
      quantity: qty,
      total_price: total,
      reference_code: code,
    });
    setBusy(false);
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setConfirmed({ zooName: zoo.name, date, type: typeLabel, qty, total, code });
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-card">
      <h2 className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        <TicketIcon className="h-4 w-4 text-leaf" /> Book tickets
      </h2>
      <form onSubmit={submit} className="mt-3 space-y-3">
        <div>
          <label className="text-xs font-semibold text-muted-foreground">Visit date</label>
          <input
            type="date"
            required
            min={todayISO()}
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Ticket type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as keyof Tickets)}
              className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none"
            >
              {TICKET_TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.label} — {zoo.tickets[t.key]}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-xs font-semibold text-muted-foreground">Quantity</label>
            <input
              type="number"
              min={1}
              max={20}
              required
              value={qty}
              onChange={(e) => setQty(Math.max(1, Math.min(20, Number(e.target.value) || 1)))}
              className="mt-1 w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none"
            />
          </div>
        </div>
        <div className="flex items-center justify-between rounded-2xl bg-secondary/60 px-4 py-3">
          <span className="text-sm font-medium text-muted-foreground">Total</span>
          <span className="text-lg font-semibold text-leaf-deep">₹{total}</span>
        </div>
        {error ? <p className="text-xs text-destructive">{error}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95 disabled:opacity-60"
        >
          <TicketIcon className="h-4 w-4" /> {busy ? "Booking…" : "Confirm booking"}
        </button>
      </form>
    </section>
  );
}
