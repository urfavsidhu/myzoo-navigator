import { Link } from "@tanstack/react-router";
import { Heart, Home, Languages, Map, Moon, PawPrint, Signpost, Sun, Ticket } from "lucide-react";
import type { ReactNode } from "react";
import { EmergencyButton } from "@/components/zoo/EmergencyButton";
import { ChatAssistant } from "@/components/zoo/ChatAssistant";
import { useAppPrefs } from "@/lib/app-context";
import type { TKey } from "@/lib/i18n";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/", key: "nav.home", icon: Home },
  { to: "/map", key: "nav.map", icon: Map },
  { to: "/animals", key: "nav.animals", icon: PawPrint },
  { to: "/favorites", key: "nav.saved", icon: Heart },
  { to: "/facilities", key: "nav.facilities", icon: Signpost },
  { to: "/visit", key: "nav.visit", icon: Ticket },
] as const;

function TopBar() {
  const { lang, toggleLang, dark, toggleDark, kidMode } = useAppPrefs();
  return (
    <div className="sticky top-0 z-40 flex items-center justify-between gap-2 border-b border-border/60 bg-background/85 px-4 py-2 backdrop-blur">
      <Link to="/" className="flex items-center gap-2">
        <span className="grid h-7 w-7 place-items-center rounded-full bg-leaf/15 text-leaf">
          <PawPrint className="h-4 w-4" />
        </span>
        <span className={cn("font-display text-sm font-semibold", kidMode && "text-base")}>
          {lang === "hi" ? "स्मार्ट ज़ू" : "Smart Zoo"}
        </span>
      </Link>
      <div className="flex items-center gap-2">
        <button
          onClick={toggleLang}
          aria-label="Toggle language"
          className="inline-flex items-center gap-1 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-semibold shadow-card transition-transform active:scale-95"
        >
          <Languages className="h-3.5 w-3.5 text-leaf" />
          {lang === "en" ? "EN" : "HI"}
        </button>
        <button
          onClick={toggleDark}
          aria-label="Toggle dark mode"
          className="grid h-8 w-8 place-items-center rounded-full border border-border bg-card shadow-card transition-transform active:scale-95"
        >
          {dark ? <Sun className="h-4 w-4 text-sun" /> : <Moon className="h-4 w-4 text-leaf" />}
        </button>
      </div>
    </div>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const { t, kidMode } = useAppPrefs();
  return (
    <div className={cn("min-h-screen bg-background pb-24", kidMode && "kid-mode")}>
      <div className="mx-auto w-full max-w-2xl">
        <TopBar />
        {children}
      </div>
      <EmergencyButton />
      <ChatAssistant />
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border/70 bg-card/95 backdrop-blur">
        <div className="mx-auto grid max-w-2xl grid-cols-6">
          {tabs.map(({ to, key, icon: Icon }) => (
            <Link
              key={to}
              to={to}
              activeOptions={{ exact: to === "/" }}
              className="flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium text-muted-foreground transition-colors data-[status=active]:text-primary"
            >
              <Icon className="h-5 w-5" />
              {t(key as TKey)}
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