import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, IndianRupee, Ticket as TicketIcon, Users } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { AppShell } from "@/components/zoo/AppShell";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { getZoo } from "@/data/zoo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/tickets/$ticketId")({
  head: () => ({
    meta: [
      { title: "My Ticket — Smart Zoo Navigator" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: TicketDetailPage,
});

type TicketRow = {
  id: string;
  zoo_id: string;
  visit_date: string;
  ticket_type: string;
  quantity: number;
  total_price: number;
  reference_code: string;
};

function ticketStatus(visitDate: string): { label: string; className: string } {
  const today = new Date().toISOString().slice(0, 10);
  if (visitDate === today) {
    return { label: "Active", className: "bg-leaf/15 text-leaf-deep" };
  }
  if (visitDate > today) {
    return { label: "Upcoming", className: "bg-sky-500/15 text-sky-700" };
  }
  return { label: "Expired", className: "bg-secondary text-muted-foreground" };
}

function TicketDetailPage() {
  const { ticketId } = Route.useParams();
  const { user, loading: authLoading } = useAuth();
  const [ticket, setTicket] = useState<TicketRow | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFoundError, setNotFoundError] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }
    setLoading(true);
    void (async () => {
      const { data, error } = await supabase
        .from("tickets")
        .select("id, zoo_id, visit_date, ticket_type, quantity, total_price, reference_code")
        .eq("id", ticketId)
        .eq("user_id", user.id)
        .maybeSingle();
      if (error || !data) {
        setNotFoundError(true);
      } else {
        setTicket(data as TicketRow);
      }
      setLoading(false);
    })();
  }, [ticketId, user]);

  if (authLoading || loading) {
    return (
      <AppShell>
        <p className="px-4 py-6 text-sm text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <div className="space-y-3 px-4 py-6">
          <p className="text-sm text-muted-foreground">Log in to view this ticket.</p>
          <Link
            to="/login"
            className="inline-flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground"
          >
            Log in
          </Link>
        </div>
      </AppShell>
    );
  }

  if (notFoundError || !ticket) {
    return (
      <AppShell>
        <div className="px-4 py-4">
          <Link
            to="/profile"
            className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"
          >
            <ArrowLeft className="h-4 w-4" /> Back to profile
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">This ticket could not be found.</p>
        </div>
      </AppShell>
    );
  }

  const zoo = getZoo(ticket.zoo_id);
  const zooName = zoo?.name ?? ticket.zoo_id;
  const status = ticketStatus(ticket.visit_date);

  // Everything a gate scanner needs is encoded right into the QR code, so the
  // ticket can be verified like a metro ticket even without opening the app.
  const qrPayload = JSON.stringify({
    ref: ticket.reference_code,
    ticketId: ticket.id,
    zoo: zooName,
    date: ticket.visit_date,
    type: ticket.ticket_type,
    qty: ticket.quantity,
  });

  return (
    <AppShell>
      <div className="px-4 py-4">
        <Link
          to="/profile"
          className="inline-flex items-center gap-2 text-sm font-semibold text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to profile
        </Link>
      </div>

      <div className="px-4 pb-8">
        <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-float">
          {/* Header */}
          <div className="bg-leaf-deep p-5 text-primary-foreground">
            <div className="flex items-center justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-wide text-primary-foreground/70">
                Entry ticket
              </p>
              <span className={cn("rounded-full px-2.5 py-1 text-[10px] font-bold", status.className)}>
                {status.label}
              </span>
            </div>
            <h1 className="mt-2 truncate text-xl font-semibold">{zooName}</h1>
            {zoo?.city ? (
              <p className="mt-0.5 text-sm text-primary-foreground/80">{zoo.city}</p>
            ) : null}
          </div>

          {/* Details */}
          <div className="grid grid-cols-2 gap-4 px-5 py-4">
            <Detail icon={CalendarDays} label="Visit date" value={ticket.visit_date} />
            <Detail icon={TicketIcon} label="Ticket type" value={ticket.ticket_type} />
            <Detail icon={Users} label="Quantity" value={String(ticket.quantity)} />
            <Detail icon={IndianRupee} label="Total paid" value={`₹${ticket.total_price}`} />
          </div>

          {/* Perforated divider, like a tear-off ticket stub */}
          <div className="relative flex items-center px-1">
            <div className="h-5 w-5 -translate-x-1/2 rounded-full bg-background" />
            <div className="flex-1 border-t border-dashed border-border" />
            <div className="h-5 w-5 translate-x-1/2 rounded-full bg-background" />
          </div>

          {/* Footer: scannable QR, like a metro ticket */}
          <div className="flex flex-col items-center gap-3 px-5 py-6">
            <div className="rounded-2xl border border-border bg-white p-3">
              <QRCodeSVG value={qrPayload} size={168} level="M" marginSize={0} />
            </div>
            <p className="font-mono text-xs text-muted-foreground">Ref: {ticket.reference_code}</p>
            <p className="text-center text-[11px] text-muted-foreground">
              Show this QR code at the entry gate — scanning it reveals your ticket details for
              verification.
            </p>
          </div>
        </div>
      </div>
    </AppShell>
  );
}

function Detail({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof CalendarDays;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-leaf/12 text-leaf">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-[10px] font-semibold uppercase text-muted-foreground">{label}</p>
        <p className="truncate text-sm font-semibold">{value}</p>
      </div>
    </div>
  );
}
