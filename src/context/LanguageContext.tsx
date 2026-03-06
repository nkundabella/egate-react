"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

type Language = "English" | "Français" | "Kinyarwanda";

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined,
);

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Language>("English");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const storedLang = localStorage.getItem("e-gate_language") as Language;
    if (storedLang) {
      setLangState(storedLang);
    }
  }, []);

  const setLang = (newLang: Language) => {
    setLangState(newLang);
    localStorage.setItem("e-gate_language", newLang);
  };

  // Prevent hydration mismatch by not rendering anything that depends on language initially
  // Though in a real app, i18n is typically handled server-side or via hydration techniques.
  // We'll just provide the default right away and toggle it after mount.

  return (
    <LanguageContext.Provider
      value={{ lang: mounted ? lang : "English", setLang }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
