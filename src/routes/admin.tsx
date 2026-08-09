import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { getZoo } from "@/data/zoo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [{ title: "Admin Dashboard — Smart Zoo Navigator" }],
  }),
  component: AdminPage,
});

type AdminUser = {
  id: string;
  email: string | null;
  full_name: string | null;
  gender: string | null;
  created_at: string;
  review_count: number;
  ticket_count: number;
};

type TicketRow = {
  id: string;
  user_id: string;
  zoo_id: string;
  visit_date: string;
  ticket_type: string;
  quantity: number;
  total_price: number;
  created_at: string;
};

type ReviewRow = {
  id: string;
  user_id: string;
  animal_id: string;
  rating: number;
  text: string;
  created_at: string;
};

type ReportRow = {
  id: string;
  user_id: string;
  category: string;
  target_type: string | null;
  target_id: string | null;
  message: string;
  status: string;
  created_at: string;
};

function ticketStatus(visitDate: string) {
  const today = new Date().toISOString().slice(0, 10);
  if (visitDate === today) return { label: "Active", className: "bg-leaf/15 text-leaf-deep" };
  if (visitDate > today) return { label: "Upcoming", className: "bg-sky-500/15 text-sky-700" };
  return { label: "Expired", className: "bg-secondary text-muted-foreground" };
}

function AdminPage() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const [checked, setChecked] = useState(false);
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      void navigate({ to: "/login" });
      return;
    }
    void (async () => {
      const { data } = await supabase.rpc("is_admin");
      if (data) {
        setAllowed(true);
      } else {
        void navigate({ to: "/" });
      }
      setChecked(true);
    })();
  }, [authLoading, user, navigate]);

  if (authLoading || !checked) {
    return (
      <AppShell>
        <PageHeader title="Admin" />
        <p className="px-4 text-sm text-muted-foreground">Checking access…</p>
      </AppShell>
    );
  }

  if (!allowed) return null;

  return <AdminDashboard />;
}

function AdminDashboard() {
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [reviews, setReviews] = useState<ReviewRow[]>([]);
  const [reports, setReports] = useState<ReportRow[]>([]);
  const [signups, setSignups] = useState<{ day: string; count: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const load = useMemo(
    () => async () => {
      setLoading(true);
      const [u, t, r, rep, s] = await Promise.all([
        supabase.rpc("admin_list_users"),
        supabase
          .from("tickets")
          .select("id, user_id, zoo_id, visit_date, ticket_type, quantity, total_price, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("reviews")
          .select("id, user_id, animal_id, rating, text, created_at")
          .order("created_at", { ascending: false }),
        supabase
          .from("reports")
          .select("id, user_id, category, target_type, target_id, message, status, created_at")
          .order("created_at", { ascending: false }),
        supabase.rpc("admin_signups_per_day"),
      ]);
      setUsers((u.data as AdminUser[] | null) ?? []);
      setTickets((t.data as TicketRow[] | null) ?? []);
      setReviews((r.data as ReviewRow[] | null) ?? []);
      setReports((rep.data as ReportRow[] | null) ?? []);
      setSignups((s.data as { day: string; count: number }[] | null) ?? []);
      setLoading(false);
    },
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const userById = useMemo(() => {
    const map = new Map<string, AdminUser>();
    for (const u of users) map.set(u.id, u);
    return map;
  }, [users]);

  const nameFor = (userId: string) =>
    userById.get(userId)?.full_name || userById.get(userId)?.email || userId.slice(0, 8);

  const filteredUsers = useMemo(
    () =>
      users.filter((u) =>
        `${u.full_name ?? ""} ${u.email ?? ""}`.toLowerCase().includes(search.toLowerCase()),
      ),
    [users, search],
  );

  const openReports = reports.filter((r) => r.status !== "resolved").length;

  const deleteReview = async (id: string) => {
    await supabase.from("reviews").delete().eq("id", id);
    setReviews((prev) => prev.filter((r) => r.id !== id));
  };

  const resolveReport = async (id: string) => {
    await supabase.from("reports").update({ status: "resolved" }).eq("id", id);
    setReports((prev) => prev.map((r) => (r.id === id ? { ...r, status: "resolved" } : r)));
  };

  return (
    <AppShell>
      <PageHeader title="Admin Dashboard" subtitle="Manage users, bookings and moderation" />
      <div className="space-y-5 px-4 pb-6">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3">
              <StatCard label="Total users" value={users.length} />
              <StatCard label="Tickets booked" value={tickets.length} />
              <StatCard label="Reviews submitted" value={reviews.length} />
              <StatCard label="Open reports" value={openReports} />
            </div>

            <section className="rounded-3xl border border-border bg-card p-4 shadow-card">
              <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Signups — last 30 days
              </h2>
              <div className="mt-2 h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={signups}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis
                      dataKey="day"
                      tickFormatter={(d: string) => d.slice(5)}
                      fontSize={10}
                    />
                    <YAxis allowDecimals={false} fontSize={10} width={24} />
                    <Tooltip />
                    <Bar dataKey="count" fill="var(--color-leaf, #4c9a5b)" radius={4} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </section>

            <Tabs defaultValue="users" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="users">Users</TabsTrigger>
                <TabsTrigger value="tickets">Tickets</TabsTrigger>
                <TabsTrigger value="reviews">Reviews</TabsTrigger>
                <TabsTrigger value="reports">Reports</TabsTrigger>
              </TabsList>

              <TabsContent value="users" className="mt-3 space-y-2">
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search by name or email…"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none"
                />
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
                  {filteredUsers.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No users found.</p>
                  ) : (
                    filteredUsers.map((u, i) => (
                      <div
                        key={u.id}
                        className={cn(
                          "grid grid-cols-[minmax(0,1fr)_auto] gap-2 px-4 py-3",
                          i > 0 && "border-t border-border/70",
                        )}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {u.full_name || "—"}
                          </p>
                          <p className="truncate text-xs text-muted-foreground">{u.email}</p>
                          <p className="mt-0.5 text-[11px] text-muted-foreground">
                            {u.gender ?? "—"} · joined{" "}
                            {new Date(u.created_at).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="shrink-0 text-right text-[11px] text-muted-foreground">
                          <p>{u.review_count} reviews</p>
                          <p>{u.ticket_count} tickets</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="tickets" className="mt-3">
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
                  {tickets.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No bookings yet.</p>
                  ) : (
                    tickets.map((t, i) => {
                      const status = ticketStatus(t.visit_date);
                      return (
                        <div
                          key={t.id}
                          className={cn(
                            "px-4 py-3",
                            i > 0 && "border-t border-border/70",
                          )}
                        >
                          <div className="flex items-center justify-between gap-2">
                            <p className="truncate text-sm font-semibold">{nameFor(t.user_id)}</p>
                            <span
                              className={cn(
                                "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                                status.className,
                              )}
                            >
                              {status.label}
                            </span>
                          </div>
                          <p className="mt-0.5 text-xs text-muted-foreground">
                            {getZoo(t.zoo_id)?.name ?? t.zoo_id} · {t.visit_date} ·{" "}
                            {t.ticket_type} × {t.quantity} · ₹{t.total_price}
                          </p>
                        </div>
                      );
                    })
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reviews" className="mt-3">
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
                  {reviews.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No reviews yet.</p>
                  ) : (
                    reviews.map((r, i) => (
                      <div
                        key={r.id}
                        className={cn(
                          "flex items-start justify-between gap-2 px-4 py-3",
                          i > 0 && "border-t border-border/70",
                        )}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {nameFor(r.user_id)} · {r.animal_id} · {r.rating}★
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{r.text}</p>
                        </div>
                        <button
                          onClick={() => void deleteReview(r.id)}
                          className="shrink-0 rounded-full border border-destructive/40 px-2.5 py-1 text-[11px] font-semibold text-destructive"
                        >
                          Delete
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              <TabsContent value="reports" className="mt-3">
                <div className="overflow-hidden rounded-3xl border border-border bg-card shadow-card">
                  {reports.length === 0 ? (
                    <p className="p-4 text-sm text-muted-foreground">No reports yet.</p>
                  ) : (
                    reports.map((r, i) => (
                      <div
                        key={r.id}
                        className={cn(
                          "flex items-start justify-between gap-2 px-4 py-3",
                          i > 0 && "border-t border-border/70",
                        )}
                      >
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {nameFor(r.user_id)} · {r.category}
                          </p>
                          <p className="mt-0.5 text-xs text-muted-foreground">{r.message}</p>
                        </div>
                        {r.status === "resolved" ? (
                          <span className="shrink-0 rounded-full bg-leaf/15 px-2.5 py-1 text-[11px] font-semibold text-leaf-deep">
                            Resolved
                          </span>
                        ) : (
                          <button
                            onClick={() => void resolveReport(r.id)}
                            className="shrink-0 rounded-full border border-border px-2.5 py-1 text-[11px] font-semibold"
                          >
                            Mark resolved
                          </button>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
        <Link
          to="/profile"
          className="flex w-full items-center justify-center rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold shadow-card"
        >
          Back to profile
        </Link>
      </div>
    </AppShell>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
      <p className="text-xs font-semibold uppercase text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold text-leaf-deep">{value}</p>
    </div>
  );
}
