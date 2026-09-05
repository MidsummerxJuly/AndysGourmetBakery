"use client";

import { useLanguage } from "../context/LanguageContext";

export default function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLang}
      className={`languageToggle ${className}`}
      aria-label={t("toggle.label")}
    >
      <span className={lang === "en" ? "languageToggleActive" : ""}>EN</span>
      <span className="languageToggleDivider">/</span>
      <span className={lang === "es" ? "languageToggleActive" : ""}>ES</span>
    </button>
  );
}
