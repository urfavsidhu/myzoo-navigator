import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useState } from "react";
import {
  Camera,
  Clock,
  Compass,
  Heart,
  MapPin,
  PawPrint,
  Search,
  Signpost,
  Sparkles,
  Ticket,
  Map as MapIcon,
} from "lucide-react";
import { AppShell } from "@/components/zoo/AppShell";
import { WeatherCard } from "@/components/zoo/WeatherCard";
import { useZoo } from "@/lib/zoo-context";
import { useAppPrefs } from "@/lib/app-context";
import { cn } from "@/lib/utils";
import { zoos, zooAnimals } from "@/data/zoo-data";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Smart Zoo Navigator — Explore UP Zoos" },
      {
        name: "description",
        content:
          "Maps, walking directions, animal guides and facilities for zoos across Uttar Pradesh.",
      },
      { property: "og:title", content: "Smart Zoo Navigator — Explore UP Zoos" },
      {
        property: "og:description",
        content: "Find animals, restrooms and food courts inside Uttar Pradesh zoos.",
      },
    ],
  }),
  component: Index,
});

const quickLinks = [
  { to: "/map", label: "Map", icon: MapIcon },
  { to: "/animals", label: "Animals", icon: PawPrint },
  { to: "/visit", label: "Tickets", icon: Ticket },
  { to: "/visit", label: "Timings", icon: Clock },
] as const;

const moreLinks = [
  { to: "/facilities", label: "Facilities", labelHi: "सुविधाएँ", icon: Signpost },
  { to: "/favorites", label: "Saved", labelHi: "सहेजे", icon: Heart },
  { to: "/photo-spots", label: "Photo Spots", labelHi: "फोटो स्पॉट", icon: Camera },
  { to: "/hunt", label: "Treasure Hunt", labelHi: "खज़ाना खोज", icon: Compass },
  { to: "/quiz", label: "Animal Quiz", labelHi: "जानवर क्विज़", icon: Sparkles },
] as const;

function Index() {
  const { zoo, zooId, setZooId } = useZoo();
  const { t, lang } = useAppPrefs();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const count = zooAnimals(zooId).length;

  return (
    <AppShell>
      <section className="relative h-72 w-full overflow-hidden">
        <img
          src={zoo.image}
          alt={`${zoo.name} in ${zoo.city}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-leaf-deep/95 via-leaf-deep/40 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5">
          <p className="text-xs font-semibold tracking-[0.2em] text-sun uppercase">
            Uttar Pradesh
          </p>
          <h1 className="mt-1 text-3xl font-semibold text-primary-foreground">
            {t("page.home")}
          </h1>
          <p className="mt-1 text-sm text-primary-foreground/80">
            Find every animal, washroom and shortcut inside the zoo.
          </p>
        </div>
      </section>

      <div className="space-y-6 px-4 py-5">
        <WeatherCard />

        <div className="rounded-3xl border border-border bg-card p-4 shadow-card">
          <label className="text-xs font-semibold text-muted-foreground uppercase">
            {t("label.chooseZoo")}
          </label>
          <Select value={zooId} onValueChange={setZooId}>
            <SelectTrigger className="mt-2 h-12 w-full rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {zoos.map((z) => (
                <SelectItem key={z.id} value={z.id}>
                  {z.city} — {z.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="mt-3 flex items-center gap-1.5 text-xs text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 text-leaf" />
            {zoo.hours} · {count} species on display
          </p>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            navigate({ to: "/search", search: { q: query } });
          }}
          className="flex items-center gap-2 rounded-full border border-border bg-card px-4 py-3 shadow-card"
        >
          <Search className="h-5 w-5 shrink-0 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search.placeholder")}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </form>

        <div className="grid grid-cols-4 gap-3">
          {quickLinks.map(({ to, label, icon: Icon }) => (
            <Link
              key={label}
              to={to}
              className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card py-4 text-xs font-medium shadow-card transition-transform active:scale-95"
            >
              <span className="grid h-10 w-10 place-items-center rounded-full bg-leaf/12 text-leaf">
                <Icon className="h-5 w-5" />
              </span>
              {label}
            </Link>
          ))}
        </div>

        <section>
          <h2 className="text-lg font-semibold">{t("label.quickLinks")}</h2>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {moreLinks.map(({ to, label, labelHi, icon: Icon }) => (
              <Link
                key={to}
                to={to}
                className="flex items-center gap-3 rounded-2xl border border-border bg-card p-3 text-sm font-semibold shadow-card transition-transform active:scale-95"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf/12 text-leaf">
                  <Icon className="h-4.5 w-4.5" />
                </span>
                <span className="truncate">{lang === "hi" ? labelHi : label}</span>
              </Link>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-lg font-semibold">Popular zoos in Uttar Pradesh</h2>
          <div className="-mx-4 mt-3 flex snap-x gap-3 overflow-x-auto px-4 pb-2 no-scrollbar">
            {zoos.map((z) => (
              <button
                key={z.id}
                onClick={() => setZooId(z.id)}
                className="w-56 shrink-0 snap-start overflow-hidden rounded-3xl border border-border bg-card text-left shadow-card transition-transform active:scale-95"
              >
                <img src={z.image} alt={z.name} className="h-28 w-full object-cover" />
                <div className="p-3">
                  <p className="text-sm font-semibold">{z.city}</p>
                  <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">{z.blurb}</p>
                  <p className="mt-2 text-[11px] font-medium text-leaf">
                    {z.animalIds.length} species · {z.ticket}
                  </p>
                </div>
              </button>
            ))}
          </div>
        </section>
      </div>
    </AppShell>
  );
}
