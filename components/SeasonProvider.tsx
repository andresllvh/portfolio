"use client";

import {
  createContext,
  useCallback,
  useContext,
  useState,
  type ReactNode,
} from "react";
import {
  DEFAULT_SEASON,
  SEASONS,
  getPalette,
  type SeasonId,
  type SeasonPalette,
} from "@/lib/seasons";

type SeasonCtx = {
  id: SeasonId;
  palette: SeasonPalette;
  setSeason: (id: SeasonId) => void;
};

const Ctx = createContext<SeasonCtx | null>(null);

const STORAGE_KEY = "portfolio-season";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365; // 1 year

export default function SeasonProvider({
  children,
  initialSeason,
}: {
  children: ReactNode;
  initialSeason: SeasonId;
}) {
  // Initialised from the server-read cookie value so the client state matches
  // the SSR-rendered DOM attribute without needing a useEffect sync.
  const [id, setId] = useState<SeasonId>(initialSeason);

  const setSeason = useCallback((next: SeasonId) => {
    setId(next);
    document.documentElement.dataset.season = next;
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // Ignore quota/availability errors — the UI still updates in-memory.
    }
    // Write a cookie so the server can read the preference on the next request
    // and SSR the correct season without any boot script.
    document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=${COOKIE_MAX_AGE}; SameSite=Lax`;
  }, []);

  const palette = getPalette(id);

  return (
    <Ctx.Provider value={{ id, palette, setSeason }}>{children}</Ctx.Provider>
  );
}

export function useSeason(): SeasonCtx {
  const ctx = useContext(Ctx);
  if (!ctx) {
    // Outside the provider (e.g. during SSR before hydration of a leaf),
    // fall back to defaults rather than throwing. Keeps rendering robust.
    return {
      id: DEFAULT_SEASON,
      palette: getPalette(DEFAULT_SEASON),
      setSeason: () => {},
    };
  }
  return ctx;
}
