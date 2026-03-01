"use client";

import { useLanguage } from "@/contexts/language-context";

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center gap-2 text-xs text-zinc-400">
      <span className="uppercase tracking-wide">
        {language === "en" ? "Language" : "Idioma"}
      </span>
      <div className="inline-flex items-center rounded-full bg-zinc-900/80 p-0.5 ring-1 ring-zinc-800">
        <button
          type="button"
          onClick={() => setLanguage("en")}
          className={`px-2 py-1 text-[11px] font-medium rounded-full transition-colors ${
            language === "en"
              ? "bg-zinc-100 text-black"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          EN
        </button>
        <button
          type="button"
          onClick={() => setLanguage("es")}
          className={`px-2 py-1 text-[11px] font-medium rounded-full transition-colors ${
            language === "es"
              ? "bg-zinc-100 text-black"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          ES
        </button>
      </div>
    </div>
  );
}

