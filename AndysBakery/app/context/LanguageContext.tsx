"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useSyncExternalStore,
} from "react";
import { getTranslation, Language, translations } from "../lib/translations";

type LanguageContextValue = {
  lang: Language;
  setLang: (lang: Language) => void;
  toggleLang: () => void;
  t: (key: string, fallback?: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | null>(null);

const STORAGE_KEY = "bakery-lang";

function getSnapshot(): Language {
  if (typeof window === "undefined") return "en";
  const stored = window.localStorage.getItem(STORAGE_KEY) as Language | null;
  return stored && stored in translations ? stored : "en";
}

function getServerSnapshot(): Language {
  return "en";
}

function subscribe(callback: () => void) {
  function onStorage(event: StorageEvent) {
    if (event.key === STORAGE_KEY) callback();
  }

  window.addEventListener("storage", onStorage);
  return () => window.removeEventListener("storage", onStorage);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const lang = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setLang = useCallback((next: Language) => {
    if (next in translations) {
      window.localStorage.setItem(STORAGE_KEY, next);
      window.dispatchEvent(
        new StorageEvent("storage", { key: STORAGE_KEY, newValue: next })
      );
    }
  }, []);

  const toggleLang = useCallback(() => {
    setLang(lang === "en" ? "es" : "en");
  }, [lang, setLang]);

  const t = useCallback(
    (key: string, fallback?: string) => getTranslation(lang, key, fallback),
    [lang]
  );

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error(
      "useLanguage must be used within a LanguageProvider"
    );
  }
  return context;
}
