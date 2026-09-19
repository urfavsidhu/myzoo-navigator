import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import type { Area } from "react-easy-crop";
import { Camera, LogOut, Pencil, ShieldCheck, Ticket, Trash2 } from "lucide-react";
import { AppShell, PageHeader } from "@/components/zoo/AppShell";
import { AvatarCropperModal } from "@/components/zoo/AvatarCropperModal";
import { StarRating } from "@/components/zoo/StarRating";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/lib/auth-context";
import { useReviews } from "@/lib/reviews-context";
import { getCroppedImageBlob } from "@/lib/image-crop";
import { getAnimal, getZoo } from "@/data/zoo-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/profile")({
  head: () => ({
    meta: [
      { title: "My Profile — Smart Zoo Navigator" },
      { name: "description", content: "Manage your profile, reviews and issue reports." },
      { property: "og:title", content: "My Profile — Smart Zoo Navigator" },
      { property: "og:description", content: "Your Smart Zoo Navigator account." },
    ],
  }),
  component: ProfilePage,
});

const GENDERS = ["Male", "Female", "Other", "Prefer not to say"];
const CATEGORIES = ["Wrong info", "Broken facility", "Inappropriate review", "Other"];

type Report = {
  id: string;
  category: string;
  message: string;
  status: string;
  created_at: string;
};

function ProfilePage() {
  const navigate = useNavigate();
  const { user, profile, loading, refreshProfile, signOut } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (!user) {
      setIsAdmin(false);
      return;
    }
    void (async () => {
      const { data } = await supabase.rpc("is_admin");
      setIsAdmin(Boolean(data));
    })();
  }, [user]);

  if (loading) {
    return (
      <AppShell>
        <PageHeader title="My Profile" />
        <p className="px-4 text-sm text-muted-foreground">Loading…</p>
      </AppShell>
    );
  }

  if (!user) {
    return (
      <AppShell>
        <PageHeader title="My Profile" subtitle="Log in to view your account" />
        <div className="px-4">
          <Link
            to="/login"
            className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground"
          >
            Log in
          </Link>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell>
      <PageHeader title="My Profile" subtitle={user.email ?? ""} />
      <div className="space-y-4 px-4 pb-6">
        <ProfileForm
          userId={user.id}
          profile={profile}
          onSaved={refreshProfile}
        />
        <MyTickets userId={user.id} />
        <MyReviews />
        <Reports userId={user.id} />
        {isAdmin ? (
          <Link
            to="/admin"
            className="flex w-full items-center justify-center gap-2 rounded-full border border-leaf/40 bg-leaf/10 px-4 py-3 text-sm font-semibold text-leaf-deep"
          >
            <ShieldCheck className="h-4 w-4" /> Admin dashboard
          </Link>
        ) : null}
        <button
          onClick={async () => {
            await signOut();
            void navigate({ to: "/" });
          }}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold shadow-card"
        >
          <LogOut className="h-4 w-4" /> Log out
        </button>
      </div>
    </AppShell>
  );
}

function ProfileForm({
  userId,
  profile,
  onSaved,
}: {
  userId: string;
  profile: { full_name: string | null; bio: string | null; gender: string | null; interests: string[]; avatar_url: string | null } | null;
  onSaved: () => Promise<void>;
}) {
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [bio, setBio] = useState(profile?.bio ?? "");
  const [gender, setGender] = useState(profile?.gender ?? "");
  const [interests, setInterests] = useState<string[]>(profile?.interests ?? []);
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url ?? "");
  const [status, setStatus] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [cropImageSrc, setCropImageSrc] = useState<string | null>(null);

  useEffect(() => {
    setFullName(profile?.full_name ?? "");
    setBio(profile?.bio ?? "");
    setGender(profile?.gender ?? "");
    setInterests(profile?.interests ?? []);
    setAvatarUrl(profile?.avatar_url ?? "");
  }, [profile]);

  const upload = async (fileOrBlob: File | Blob) => {
    setBusy(true);
    setStatus(null);
    const path = `${userId}/avatar-${Date.now()}.jpg`;
    const { error } = await supabase.storage.from("avatars").upload(path, fileOrBlob, {
      upsert: true,
      contentType: "image/jpeg",
    });
    if (error) {
      setStatus(error.message);
      setBusy(false);
      return;
    }
    const { data } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365);
    setAvatarUrl(data?.signedUrl ?? "");
    setBusy(false);
  };

  const closeCropper = () => {
    if (cropImageSrc) URL.revokeObjectURL(cropImageSrc);
    setCropImageSrc(null);
  };

  const handleCropConfirm = async (areaPixels: Area) => {
    if (!cropImageSrc) return;
    setBusy(true);
    const blob = await getCroppedImageBlob(cropImageSrc, areaPixels);
    closeCropper();
    await upload(blob);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({
        id: userId,
        full_name: fullName.trim() || null,
        bio: bio.trim() || null,
        gender: gender || null,
        interests,
        avatar_url: avatarUrl || null,
      });
    setBusy(false);
    setStatus(error ? error.message : "Profile saved");
    if (!error) await onSaved();
  };

  return (
    <>
      <form onSubmit={save} className="space-y-3 rounded-3xl border border-border bg-card p-4 shadow-card">
        <div className="flex items-center gap-3">
          <div className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-secondary">
            {avatarUrl ? (
              <img src={avatarUrl} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <Camera className="h-5 w-5 text-muted-foreground" />
            )}
          </div>
          <label className="cursor-pointer rounded-full border border-border px-3 py-2 text-xs font-semibold">
            Change photo
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) setCropImageSrc(URL.createObjectURL(f));
                // Reset so choosing the same file again still fires onChange.
                e.target.value = "";
              }}
            />
          </label>
        </div>

        <input
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          placeholder="Full name"
          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none"
        />
        <textarea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Short bio"
          rows={3}
          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none"
        />
        <select
          value={gender}
          onChange={(e) => setGender(e.target.value)}
          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none"
        >
          <option value="">Gender…</option>
          {GENDERS.map((g) => (
            <option key={g} value={g}>
              {g}
            </option>
          ))}
        </select>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((i) => {
            const on = interests.includes(i);
            return (
              <button
                key={i}
                type="button"
                onClick={() =>
                  setInterests((prev) => (on ? prev.filter((p) => p !== i) : [...prev, i]))
                }
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold transition-colors",
                  on ? "border-leaf bg-leaf/15 text-leaf-deep" : "border-border text-muted-foreground",
                )}
              >
                {i}
              </button>
            );
          })}
        </div>
        {status ? <p className="text-xs text-muted-foreground">{status}</p> : null}
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          Save profile
        </button>
      </form>

      {cropImageSrc ? (
        <AvatarCropperModal
          imageSrc={cropImageSrc}
          busy={busy}
          onCancel={closeCropper}
          onConfirm={(area) => void handleCropConfirm(area)}
        />
      ) : null}
    </>
  );
}

function MyReviews() {
  const { myReviews, updateReview, deleteReview } = useReviews();
  const [editId, setEditId] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-card">
      <h2 className="text-base font-semibold">My reviews</h2>
      {myReviews.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">You haven't written any reviews yet.</p>
      ) : (
        <ul className="mt-3 space-y-3">
          {myReviews.map((r) => (
            <li key={r.id} className="rounded-2xl bg-secondary/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{getAnimal(r.animalId)?.name ?? r.animalId}</p>
                <div className="flex items-center gap-1">
                  <button
                    aria-label="Edit review"
                    onClick={() => {
                      setEditId(r.id);
                      setText(r.text);
                      setRating(r.rating);
                    }}
                    className="rounded-full bg-card p-1.5"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label="Delete review"
                    onClick={() => void deleteReview(r.id)}
                    className="rounded-full bg-card p-1.5 text-destructive"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              {editId === r.id ? (
                <div className="mt-2 space-y-2">
                  <StarRating value={rating} onChange={setRating} />
                  <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    className="w-full rounded-full border border-border bg-background px-3 py-2 text-sm outline-none"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={async () => {
                        const { error } = await updateReview(r.id, { rating, text });
                        if (!error) setEditId(null);
                      }}
                      className="flex-1 rounded-full bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="rounded-full border border-border px-3 py-2 text-xs font-semibold"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <StarRating value={r.rating} />
                  <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}

type TicketRow = {
  id: string;
  zoo_id: string;
  visit_date: string;
  ticket_type: string;
  quantity: number;
  total_price: number;
  reference_code: string;
};

function ticketStatus(visitDate: string): { label: string; className: string; faded: boolean } {
  const today = new Date().toISOString().slice(0, 10);
  if (visitDate === today) {
    return { label: "Active", className: "bg-leaf/15 text-leaf-deep", faded: false };
  }
  if (visitDate > today) {
    return { label: "Upcoming", className: "bg-sky-500/15 text-sky-700", faded: false };
  }
  return { label: "Expired", className: "bg-secondary text-muted-foreground", faded: true };
}

function MyTickets({ userId }: { userId: string }) {
  const [tickets, setTickets] = useState<TicketRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void (async () => {
      const { data } = await supabase
        .from("tickets")
        .select("id, zoo_id, visit_date, ticket_type, quantity, total_price, reference_code")
        .eq("user_id", userId)
        .order("visit_date", { ascending: false });
      setTickets((data as TicketRow[] | null) ?? []);
      setLoading(false);
    })();
  }, [userId]);

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-card">
      <h2 className="flex items-center gap-2 text-base font-semibold">
        <Ticket className="h-4 w-4 text-leaf" /> My tickets
      </h2>
      {loading ? (
        <p className="mt-2 text-sm text-muted-foreground">Loading…</p>
      ) : tickets.length === 0 ? (
        <p className="mt-2 text-sm text-muted-foreground">
          No tickets yet — book one from the Tickets &amp; Timings page.
        </p>
      ) : (
        <ul className="mt-3 space-y-2">
          {tickets.map((t) => {
            const status = ticketStatus(t.visit_date);
            const zooName = getZoo(t.zoo_id)?.name ?? t.zoo_id;
            return (
              <li key={t.id}>
                <Link
                  to="/tickets/$ticketId"
                  params={{ ticketId: t.id }}
                  className={cn(
                    "block rounded-2xl bg-secondary/60 p-3 transition-colors active:bg-secondary",
                    status.faded && "opacity-60",
                  )}
                >
                  <div className="flex items-center justify-between gap-2">
                    <p className="truncate text-sm font-semibold">{zooName}</p>
                    <span
                      className={cn(
                        "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold",
                        status.className,
                      )}
                    >
                      {status.label}
                    </span>
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.visit_date} · {t.ticket_type} × {t.quantity} · ₹{t.total_price}
                  </p>
                  <p className="mt-1 font-mono text-[10px] text-muted-foreground">
                    Ref: {t.reference_code}
                  </p>
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

function Reports({ userId }: { userId: string }) {
  const [reports, setReports] = useState<Report[]>([]);
  const [category, setCategory] = useState(CATEGORIES[0] as string);
  const [targetId, setTargetId] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useMemo(
    () => async () => {
      const { data } = await supabase
        .from("reports")
        .select("id, category, message, status, created_at")
        .order("created_at", { ascending: false });
      setReports((data as Report[] | null) ?? []);
    },
    [],
  );

  useEffect(() => {
    void load();
  }, [load]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setBusy(true);
    await supabase.from("reports").insert({
      user_id: userId,
      category,
      target_type: targetId ? "animal" : null,
      target_id: targetId || null,
      message: message.trim(),
    });
    setBusy(false);
    setMessage("");
    setTargetId("");
    await load();
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-card">
      <h2 className="text-base font-semibold">Report an issue</h2>
      <form onSubmit={submit} className="mt-3 space-y-2">
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none"
        >
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <input
          value={targetId}
          onChange={(e) => setTargetId(e.target.value)}
          placeholder="Related animal or facility (optional)"
          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none"
        />
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={3}
          placeholder="What went wrong?"
          className="w-full rounded-2xl border border-border bg-background px-4 py-2.5 text-sm outline-none"
        />
        <button
          type="submit"
          disabled={busy}
          className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-60"
        >
          Submit report
        </button>
      </form>
      <h3 className="mt-4 text-sm font-semibold">My reports</h3>
      {reports.length === 0 ? (
        <p className="mt-1 text-sm text-muted-foreground">No reports yet.</p>
      ) : (
        <ul className="mt-2 space-y-2">
          {reports.map((r) => (
            <li key={r.id} className="rounded-2xl bg-secondary/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{r.category}</p>
                <span
                  className={cn(
                    "rounded-full px-2 py-0.5 text-[10px] font-semibold",
                    r.status === "resolved"
                      ? "bg-leaf/15 text-leaf-deep"
                      : "bg-sun/20 text-foreground",
                  )}
                >
                  {r.status === "resolved" ? "Resolved" : "Open"}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{r.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
