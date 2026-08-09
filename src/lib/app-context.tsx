import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dict, type Lang, type TKey } from "@/lib/i18n";

type AppPrefsValue = {
  lang: Lang;
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (key: TKey) => string;
  dark: boolean;
  toggleDark: () => void;
};

const AppPrefsContext = createContext<AppPrefsValue | null>(null);

export function AppPrefsProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle("dark", dark);
  }, [dark]);

  const t = useCallback((key: TKey) => dict[lang][key] ?? dict.en[key], [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang,
      toggleLang: () => setLang((l) => (l === "en" ? "hi" : "en")),
      t,
      dark,
      toggleDark: () => setDark((d) => !d),
    }),
    [lang, t, dark],
  );

  return <AppPrefsContext.Provider value={value}>{children}</AppPrefsContext.Provider>;
}

export function useAppPrefs() {
  const ctx = useContext(AppPrefsContext);
  if (!ctx) throw new Error("useAppPrefs must be used inside AppPrefsProvider");
  return ctx;
}
