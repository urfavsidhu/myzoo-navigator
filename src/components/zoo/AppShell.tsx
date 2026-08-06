import { Link } from "@tanstack/react-router";
import { Heart, Home, Map, PawPrint, Signpost, Ticket } from "lucide-react";
import type { ReactNode } from "react";
import { EmergencyButton } from "@/components/zoo/EmergencyButton";

const tabs = [
  { to: "/", label: "Home", icon: Home },
  { to: "/map", label: "Map", icon: Map },
  { to: "/animals", label: "Animals", icon: PawPrint },
  { to: "/favorites", label: "Saved", icon: Heart },
  { to: "/facilities", label: "Facilities", icon: Signpost },
  { to: "/visit", label: "Visit", icon: Ticket },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="mx-auto w-full max-w-2xl">{children}</div>
      <EmergencyButton />
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-6">
          {tabs.map(({ to, label, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <Icon className="h-5 w-5" />
              {label}
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 px-4 pt-6 pb-3">
      <div className="min-w-0">
        <h1 className="truncate text-2xl font-semibold text-foreground">{title}</h1>
        {subtitle ? (
          <p className="mt-0.5 truncate text-sm text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </header>
  );
}