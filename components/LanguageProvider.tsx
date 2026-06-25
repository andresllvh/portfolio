"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_LANG,
  translate,
  type Lang,
} from "@/lib/i18n";

type LanguageCtx = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  t: (path: string) => string;
};

const Ctx = createContext<LanguageCtx | null>(null);

const STORAGE_KEY = "portfolio-lang";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export default function LanguageProvider({
  children,
  initialLang,
}: {
  children: ReactNode;
  initialLang: Lang;
}) {
  // Initialised from the server-read cookie value so the client state matches
  // the SSR-rendered DOM attribute without needing a useEffect sync.
  const [lang, setLangState] = useState<Lang>(initialLang);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    document.documentElement.lang = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore — state still updates in-memory.
    }
    // Write a cookie so the server can read the preference on the next request
    // and SSR the correct language without any boot script.
    document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }, []);

  const t = useCallback((path: string) => translate(path, lang), [lang]);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useLanguage(): LanguageCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Safe fallback outside the provider: default language, no-op setter.
    return {
      lang: DEFAULT_LANG,
      setLang: () => {},
      t: (path) => translate(path, DEFAULT_LANG),
    };
  }
  return ctx;
}
