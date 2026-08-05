import { useState } from "react";
import {
  Accessibility,
  CircleParking,
  Cross,
  Croissant,
  DoorOpen,
  GlassWater,
  Minus,
  Plus,
  Toilet,
  type LucideIcon,
} from "lucide-react";
import type { Animal, Facility, FacilityKind } from "@/data/zoo-data";
import { youAreHere } from "@/data/zoo-data";
import { cn } from "@/lib/utils";

export const facilityIcon: Record<FacilityKind, LucideIcon> = {
  gate: DoorOpen,
  restroom: Toilet,
  food: Croissant,
  water: GlassWater,
  firstaid: Cross,
  parking: CircleParking,
  accessible: Accessibility,
};

export type MapPoint =
  | { type: "animal"; data: Animal }
  | { type: "facility"; data: Facility };

export function ZooMap({
  animals,
  facilities,
  selectedId,
  onSelect,
}: {
  animals: Animal[];
  facilities: Facility[];
  selectedId?: string | undefined;
  onSelect: (point: MapPoint) => void;
}) {
  const [zoom, setZoom] = useState(1);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-secondary shadow-card">
      <div className="relative aspect-4/5 w-full overflow-auto no-scrollbar">
        <div
          className="relative h-full w-full origin-top-left transition-transform duration-300"
          style={{ transform: `scale(${zoom})`, width: `${100 * zoom}%`, height: `${100 * zoom}%` }}
        >
          <MapBackdrop />

          {facilities.map((f) => {
            const Icon = facilityIcon[f.kind];
            return (
              <Marker
                key={f.id}
                x={f.x}
                y={f.y}
                active={selectedId === f.id}
                label={f.name}
                tone="facility"
                onClick={() => onSelect({ type: "facility", data: f })}
              >
                <Icon className="h-4 w-4" />
              </Marker>
            );
          })}

          {animals.map((a) => (
            <Marker
              key={a.id}
              x={a.x}
              y={a.y}
              active={selectedId === a.id}
              label={a.name}
              tone="animal"
              onClick={() => onSelect({ type: "animal", data: a })}
            >
              <span className="text-sm leading-none">{a.emoji}</span>
            </Marker>
          ))}

          <div
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${youAreHere.x}%`, top: `${youAreHere.y}%` }}
          >
            <span className="absolute inset-0 -m-3 animate-ping rounded-full bg-primary/30" />
            <span className="relative block h-4 w-4 rounded-full border-2 border-card bg-primary shadow-float" />
            <span className="absolute left-1/2 top-5 -translate-x-1/2 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold whitespace-nowrap text-primary-foreground">
              You are here
            </span>
          </div>
        </div>
      </div>

      <div className="absolute right-3 top-3 flex flex-col overflow-hidden rounded-full border border-border bg-card shadow-card">
        <button
          aria-label="Zoom in"
          onClick={() => setZoom((z) => Math.min(2.4, +(z + 0.2).toFixed(2)))}
          className="p-2 text-foreground transition-colors hover:bg-secondary"
        >
          <Plus className="h-4 w-4" />
        </button>
        <button
          aria-label="Zoom out"
          onClick={() => setZoom((z) => Math.max(1, +(z - 0.2).toFixed(2)))}
          className="border-t border-border p-2 text-foreground transition-colors hover:bg-secondary"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

function Marker({
  x,
  y,
  children,
  active,
  label,
  tone,
  onClick,
}: {
  x: number;
  y: number;
  children: React.ReactNode;
  active?: boolean;
  label: string;
  tone: "animal" | "facility";
  onClick: () => void;
}) {
  return (
    <button
      aria-label={label}
      onClick={onClick}
      className={cn(
        "absolute flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border shadow-card transition-transform duration-200 active:scale-95",
        tone === "animal"
          ? "border-leaf/40 bg-card text-foreground"
          : "border-border bg-sand text-bark",
        active && "scale-125 border-primary ring-2 ring-primary ring-offset-2 ring-offset-secondary",
      )}
      style={{ left: `${x}%`, top: `${y}%` }}
    >
      {children}
    </button>
  );
}

function MapBackdrop() {
  return (
    <svg viewBox="0 0 100 125" className="absolute inset-0 h-full w-full" aria-hidden>
      <rect width="100" height="125" fill="oklch(0.94 0.035 130)" />
      <circle cx="20" cy="24" r="16" fill="oklch(0.89 0.06 145)" />
      <circle cx="78" cy="30" r="20" fill="oklch(0.89 0.06 145)" />
      <circle cx="40" cy="90" r="22" fill="oklch(0.9 0.05 140)" />
      <ellipse cx="62" cy="102" rx="16" ry="9" fill="oklch(0.86 0.07 220)" />
      <path
        d="M50 122 L50 80 Q50 62 40 58 L20 46 M50 80 Q52 66 66 60 L86 46 M40 58 L26 66 M66 60 L74 74 M50 96 L18 86"
        stroke="oklch(0.86 0.03 90)"
        strokeWidth="5"
        strokeLinecap="round"
        fill="none"
      />
      <path
        d="M50 122 L50 80 Q50 62 40 58 L20 46 M50 80 Q52 66 66 60 L86 46 M40 58 L26 66 M66 60 L74 74 M50 96 L18 86"
        stroke="oklch(0.96 0.02 90)"
        strokeWidth="2.6"
        strokeDasharray="4 3"
        fill="none"
      />
    </svg>
  );
}