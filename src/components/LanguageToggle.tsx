"use client";

import * as React from "react";
import { Globe } from "lucide-react";
import { Button } from "./Button";
import { useLanguage } from "@/app/context/LanguageContext";

export function LanguageToggle() {
  const { lang, setLang } = useLanguage();
  const [showLangs, setShowLangs] = React.useState(false);

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setShowLangs(!showLangs)}
        className="rounded-full bg-background/50 backdrop-blur-sm border border-border shadow-sm text-foreground h-10 px-4"
      >
        <Globe className="h-4 w-4 mr-2" />
        <span className="text-xs font-semibold">{lang}</span>
      </Button>
      {showLangs && (
        <div className="absolute left-0 top-full mt-2 w-44 bg-card shadow-lg rounded-2xl p-2 border border-border text-sm flex flex-col gap-1 z-50">
          <button
            onClick={() => {
              setLang("English");
              setShowLangs(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium text-foreground"
          >
            English
          </button>
          <button
            onClick={() => {
              setLang("Français");
              setShowLangs(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium text-foreground"
          >
            Français
          </button>
          <button
            onClick={() => {
              setLang("Kinyarwanda");
              setShowLangs(false);
            }}
            className="w-full text-left px-4 py-2 hover:bg-muted rounded-xl transition-colors font-medium text-foreground"
          >
            Kinyarwanda
          </button>
        </div>
      )}
    </div>
  );
}
