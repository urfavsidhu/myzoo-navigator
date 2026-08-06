import { Cloud, CloudRain, Droplets, Sun } from "lucide-react";
import { useZoo } from "@/lib/zoo-context";
import { useAppPrefs } from "@/lib/app-context";

const icons = { sunny: Sun, cloudy: Cloud, rainy: CloudRain } as const;

export function WeatherCard() {
  const { zoo } = useZoo();
  const { t, lang } = useAppPrefs();
  const w = zoo.weather;
  if (!w) return null;
  const Icon = icons[w.condition];

  return (
    <div className="flex items-center gap-4 rounded-3xl border border-border bg-card p-4 shadow-card">
      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-sun/20 text-clay">
        <Icon className="h-7 w-7" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-xs font-semibold text-muted-foreground uppercase">
          {t("label.weather")} · {zoo.city}
        </p>
        <p className="font-display text-2xl font-semibold">{w.tempC}°C</p>
        <p className="truncate text-xs text-muted-foreground">{w.summary}</p>
      </div>
      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-leaf/12 px-3 py-1.5 text-xs font-semibold text-leaf">
        <Droplets className="h-3.5 w-3.5" />
        {w.rainChance}% {lang === "hi" ? "" : "rain"}
      </span>
    </div>
  );
}