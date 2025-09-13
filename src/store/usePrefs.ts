import { create } from "zustand";

type Prefs = {
  theme: "light" | "dark" | "system";
  consentAds: boolean;
  recentTools: string[];
  setTheme: (t: Prefs["theme"]) => void;
  setConsentAds: (v: boolean) => void;
  pushRecent: (slug: string) => void;
};

const persisted = <T>(key: string, initial: T): T => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : initial;
  } catch {
    return initial;
  }
};

export const usePrefs = create<Prefs>((set, get) => ({
  theme: persisted("theme", "system"),
  consentAds: persisted("consentAds", false),
  recentTools: persisted("recentTools", []),
  setTheme: (t) => {
    localStorage.setItem("theme", JSON.stringify(t));
    set({ theme: t });
  },
  setConsentAds: (v) => {
    localStorage.setItem("consentAds", JSON.stringify(v));
    set({ consentAds: v });
  },
  pushRecent: (slug) => {
    const uniq = Array.from(new Set([slug, ...get().recentTools])).slice(0, 8);
    localStorage.setItem("recentTools", JSON.stringify(uniq));
    set({ recentTools: uniq });
  },
}));
