import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, DoorOpen, HeartPulse, Navigation, Phone, X } from "lucide-react";
import { emergencyContacts, facilities } from "@/data/zoo-data";

export function EmergencyButton() {
  const [open, setOpen] = useState(false);
  const firstAid = facilities.find((f) => f.kind === "firstaid");
  const exit =
    facilities.find((f) => f.id === "exit-gate") ?? facilities.find((f) => f.kind === "gate");

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Emergency help"
        className="fixed bottom-24 right-4 z-40 grid h-14 w-14 place-items-center rounded-full bg-destructive text-destructive-foreground shadow-float transition-transform active:scale-90"
      >
        <AlertTriangle className="h-6 w-6" />
      </button>

      {open ? (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          <button
            aria-label="Close emergency sheet"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px]"
          />
          <div className="relative w-full max-w-2xl rounded-t-3xl border border-border bg-card p-5 pb-8 shadow-float">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
              <div className="min-w-0">
                <h2 className="flex items-center gap-2 text-lg font-semibold text-destructive">
                  <AlertTriangle className="h-5 w-5" /> Emergency help
                </h2>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Stay calm and call the nearest desk. Zoo staff wear green jackets.
                </p>
              </div>
              <button
                aria-label="Close"
                onClick={() => setOpen(false)}
                className="rounded-full bg-secondary p-1.5 text-muted-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="mt-4 space-y-2">
              {emergencyContacts.map((c) => (
                <a
                  key={c.id}
                  href={`tel:${c.number.replace(/\s/g, "")}`}
                  className="flex items-center gap-3 rounded-2xl border border-destructive/30 bg-destructive/5 p-3"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-destructive/15 text-destructive">
                    <Phone className="h-4 w-4" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{c.label}</p>
                    <p className="text-xs text-muted-foreground">{c.number}</p>
                  </div>
                  <span className="shrink-0 rounded-full bg-destructive px-3 py-1 text-xs font-semibold text-destructive-foreground">
                    Call
                  </span>
                </a>
              ))}
            </div>

            {firstAid ? (
              <div className="mt-3 flex items-center gap-3 rounded-2xl border border-border bg-secondary/60 p-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-leaf/15 text-leaf">
                  <HeartPulse className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold">{firstAid.name}</p>
                  <p className="truncate text-xs text-muted-foreground">{firstAid.description}</p>
                </div>
                <Link
                  to="/map"
                  search={{ focus: firstAid.id }}
                  onClick={() => setOpen(false)}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground"
                >
                  <Navigation className="h-3.5 w-3.5" /> Navigate
                </Link>
              </div>
            ) : null}

            {exit ? (
              <Link
                to="/map"
                search={{ focus: exit.id }}
                onClick={() => setOpen(false)}
                className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-destructive px-4 py-3 text-sm font-semibold text-destructive-foreground transition-transform active:scale-95"
              >
                <DoorOpen className="h-4 w-4" /> Navigate to nearest exit
              </Link>
            ) : null}
          </div>
        </div>
      ) : null}
    </>
  );
}
