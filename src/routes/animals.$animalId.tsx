import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Camera, Clock, Leaf, MapPin, Square, Utensils, Volume2, X } from "lucide-react";
import { AppShell } from "@/components/zoo/AppShell";
import { useZoo } from "@/lib/zoo-context";
import { getAnimal, nearbyAnimals, statusTone, type Animal } from "@/data/zoo-data";
import { cn } from "@/lib/utils";
import { FavoriteButton } from "@/components/zoo/FavoriteButton";
import { CrowdBadge } from "@/components/zoo/CrowdBadge";
import { StarRating } from "@/components/zoo/StarRating";
import { useReviews } from "@/lib/reviews-context";
import { useAppPrefs } from "@/lib/app-context";
import { useAuth } from "@/lib/auth-context";

export const Route = createFileRoute("/animals/$animalId")({
  loader: ({ params }) => {
    const animal = getAnimal(params.animalId);
    if (!animal) throw notFound();
    return { animal };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return {
        meta: [{ title: "Animal not found" }, { name: "robots", content: "noindex" }],
      };
    }
    const { animal } = loaderData;
    const description = `${animal.name} (${animal.scientificName}) — habitat, diet, feeding time and conservation status.`;
    return {
      meta: [
        { title: `${animal.name} — Smart Zoo Navigator` },
        { name: "description", content: description },
        { property: "og:title", content: `${animal.name} — Smart Zoo Navigator` },
        { property: "og:description", content: description },
        { property: "og:image", content: animal.image },
        { name: "twitter:image", content: animal.image },
      ],
    };
  },
  component: AnimalDetail,
});

function AnimalDetail() {
  const { animal } = Route.useLoaderData() as { animal: Animal };
  const { zooId } = useZoo();
  const nearby = nearbyAnimals(zooId, animal.id);
  const { lang, t } = useAppPrefs();
  const hi = lang === "hi";
  const displayName = (hi && animal.nameHi) || animal.name;
  const facts = (hi && animal.factsHi?.length ? animal.factsHi : animal.facts) ?? [];
  const [arOpen, setArOpen] = useState(false);

  return (
    <AppShell>
      <div className="relative h-64 w-full">
        <img src={animal.image} alt={displayName} className="h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-leaf-deep/90 to-transparent" />
        <Link
          to="/animals"
          className="absolute left-4 top-4 grid h-10 w-10 place-items-center rounded-full bg-card/90 shadow-card"
          aria-label="Back to animals"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <FavoriteButton animalId={animal.id} size="lg" className="absolute right-4 top-4" />
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h1 className="text-2xl font-semibold text-primary-foreground">{displayName}</h1>
          <p className="text-sm italic text-primary-foreground/80">{animal.scientificName}</p>
        </div>
      </div>

      <div className="space-y-4 px-4 py-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-semibold",
              statusTone[animal.status],
            )}
          >
            {animal.status}
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-xs font-medium">
            <Clock className="h-3.5 w-3.5 text-leaf" /> Feeding {animal.feedingTime}
          </span>
          {animal.crowdLevel ? <CrowdBadge level={animal.crowdLevel} /> : null}
        </div>

        <InfoRow icon={Leaf} label="Habitat" value={animal.habitat} />
        <InfoRow icon={Utensils} label="Diet" value={animal.diet} />
        <InfoRow icon={MapPin} label="Enclosure" value={animal.enclosure} />

        <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-base font-semibold">{hi ? "मज़ेदार तथ्य" : "Fun facts"}</h2>
            <AudioGuide animal={animal} hi={hi} displayName={displayName} facts={facts} />
          </div>
          <ul className="mt-2 space-y-2">
            {facts.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-leaf" />
                {f}
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/map"
          search={{ focus: animal.id }}
          className="flex w-full items-center justify-center gap-2 rounded-full bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition-transform active:scale-95"
        >
          <MapPin className="h-4 w-4" /> View on map
        </Link>

        <button
          onClick={() => setArOpen(true)}
          className="flex w-full items-center justify-center gap-2 rounded-full border border-border bg-card px-4 py-3 text-sm font-semibold shadow-card transition-transform active:scale-95"
        >
          <Camera className="h-4 w-4 text-leaf" /> {hi ? "एआर व्यू" : "AR View"}
        </button>

        <section>
          <h2 className="text-base font-semibold">Nearby animals</h2>
          <div className="mt-3 space-y-2">
            {nearby.map(({ animal: a, distance }) => (
              <Link
                key={a.id}
                to="/animals/$animalId"
                params={{ animalId: a.id }}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 shadow-card"
              >
                <img src={a.image} alt={a.name} className="h-12 w-12 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">{(hi && a.nameHi) || a.name}</p>
                  <p className="text-xs text-muted-foreground">{a.enclosure}</p>
                </div>
                <span className="shrink-0 rounded-full bg-leaf/12 px-2.5 py-1 text-xs font-semibold text-leaf">
                  {distance} m
                </span>
              </Link>
            ))}
          </div>
        </section>

        <ReviewsSection animalId={animal.id} />
      </div>

      {arOpen ? (
        <ArView
          image={animal.image}
          name={displayName}
          enclosure={animal.enclosure}
          facts={facts.slice(0, 2)}
          hi={hi}
          onClose={() => setArOpen(false)}
        />
      ) : null}
    </AppShell>
  );
}

function AudioGuide({
  animal,
  hi,
  displayName,
  facts,
}: {
  animal: Animal;
  hi: boolean;
  displayName: string;
  facts: readonly string[];
}) {
  const [speaking, setSpeaking] = useState(false);

  useEffect(() => {
    return () => {
      if (typeof window !== "undefined") window.speechSynthesis?.cancel();
    };
  }, []);

  const toggle = () => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) return;
    if (speaking) {
      synth.cancel();
      setSpeaking(false);
      return;
    }
    const script = hi
      ? `${displayName}। आवास: ${animal.habitat}। भोजन: ${animal.diet}। ${facts.join(" ")}`
      : `${displayName}. Habitat: ${animal.habitat}. Diet: ${animal.diet}. ${facts.join(" ")}`;
    const utter = new SpeechSynthesisUtterance(script);
    utter.lang = hi ? "hi-IN" : "en-IN";
    const voice = synth.getVoices().find((v) => v.lang.toLowerCase().startsWith(hi ? "hi" : "en"));
    if (voice) utter.voice = voice;
    utter.rate = 0.95;
    utter.onend = () => setSpeaking(false);
    utter.onerror = () => setSpeaking(false);
    synth.cancel();
    synth.speak(utter);
    setSpeaking(true);
  };

  return (
    <button
      onClick={toggle}
      aria-label={speaking ? "Stop audio guide" : "Play audio guide"}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-leaf/12 px-3 py-1.5 text-xs font-semibold text-leaf transition-transform active:scale-95"
    >
      {speaking ? <Square className="h-3.5 w-3.5" /> : <Volume2 className="h-3.5 w-3.5" />}
      {speaking ? (hi ? "रोकें" : "Stop") : hi ? "सुनें" : "Play audio"}
    </button>
  );
}

function ArView({
  image,
  name,
  enclosure,
  facts,
  hi,
  onClose,
}: {
  image: string;
  name: string;
  enclosure: string;
  facts: readonly string[];
  hi: boolean;
  onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black">
      <img
        src={image}
        alt={name}
        className="absolute inset-0 h-full w-full scale-110 object-cover blur-[2px] brightness-75"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-leaf-deep/30 via-transparent to-foreground/50" />

      <div className="pointer-events-none absolute inset-6 rounded-3xl border-2 border-primary-foreground/40" />
      <span className="absolute left-6 top-6 rounded-full bg-destructive/90 px-3 py-1 text-[10px] font-bold tracking-widest text-destructive-foreground">
        ● AR LIVE
      </span>

      <button
        onClick={onClose}
        aria-label="Close AR view"
        className="absolute right-6 top-6 grid h-10 w-10 place-items-center rounded-full bg-card/90 shadow-float"
      >
        <X className="h-5 w-5" />
      </button>

      <div className="absolute inset-x-6 bottom-10">
        <div className="rounded-3xl border border-primary-foreground/30 bg-card/85 p-4 shadow-float backdrop-blur">
          <p className="text-[10px] font-bold uppercase tracking-widest text-leaf">
            {hi ? "एआर लेबल" : "AR label"} · {enclosure}
          </p>
          <h2 className="mt-1 text-xl font-semibold">{name}</h2>
          <ul className="mt-2 space-y-1.5">
            {facts.map((f) => (
              <li key={f} className="flex gap-2 text-sm text-muted-foreground">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-sun" />
                {f}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function ReviewsSection({ animalId }: { animalId: string }) {
  const { t, lang } = useAppPrefs();
  const hi = lang === "hi";
  const { user } = useAuth();
  const { reviewsFor, averageFor, addReview, loading } = useReviews();
  const list = reviewsFor(animalId);
  const avg = averageFor(animalId);
  const [text, setText] = useState("");
  const [rating, setRating] = useState(5);
  const [busy, setBusy] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;
    setBusy(true);
    await addReview({ animalId, rating, text: text.trim() });
    setBusy(false);
    setText("");
    setRating(5);
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-4 shadow-card">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-base font-semibold">{t("label.reviews")}</h2>
        <div className="flex items-center gap-2">
          <StarRating value={avg} />
          <span className="text-xs text-muted-foreground">
            {avg ? avg.toFixed(1) : "—"} · {list.length}
          </span>
        </div>
      </div>

      <div className="mt-3 space-y-3">
        {loading ? (
          <p className="text-sm text-muted-foreground">…</p>
        ) : list.length === 0 ? (
          <p className="text-sm text-muted-foreground">{t("label.noReviews")}</p>
        ) : (
          list.map((r) => (
            <div key={r.id} className="rounded-2xl bg-secondary/60 p-3">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-semibold">{r.name}</p>
                <StarRating value={r.rating} />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{r.text}</p>
            </div>
          ))
        )}
      </div>

      {user ? (
        <form onSubmit={submit} className="mt-4 space-y-2 border-t border-border pt-4">
          <StarRating value={rating} size="lg" onChange={setRating} />
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={t("label.yourReview")}
            className="w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none"
          />
          <button
            type="submit"
            disabled={busy}
            className="w-full rounded-full bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition-transform active:scale-95 disabled:opacity-60"
          >
            {t("btn.submit")}
          </button>
        </form>
      ) : (
        <Link
          to="/login"
          className="mt-4 flex w-full items-center justify-center rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-semibold"
        >
          {hi ? "समीक्षा लिखने के लिए लॉग इन करें" : "Log in to leave a review"}
        </Link>
      )}
    </section>
  );
}

function InfoRow({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Leaf;
  label: string;
  value: string;
}) {
  return (
    <div className="flex gap-3 rounded-2xl border border-border bg-card p-3 shadow-card">
      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf/12 text-leaf">
        <Icon className="h-4 w-4" />
      </span>
      <div className="min-w-0">
        <p className="text-xs font-semibold text-muted-foreground uppercase">{label}</p>
        <p className="text-sm">{value}</p>
      </div>
    </div>
  );
}
