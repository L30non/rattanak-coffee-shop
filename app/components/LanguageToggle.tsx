"use client";

import { Languages } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { useI18n } from "@/lib/i18n";
import { LOCALE_LABELS, LOCALE_SHORT_LABELS } from "@/lib/i18n/config";

interface LanguageToggleProps {
  /** "icon" for the compact header button, "full" for the mobile menu row. */
  variant?: "icon" | "full";
  className?: string;
}

/**
 * Switches between the two locales. With exactly two languages a toggle beats
 * a dropdown — one tap, and the label always shows the language you'd get by
 * pressing it.
 */
export function LanguageToggle({
  variant = "icon",
  className,
}: LanguageToggleProps) {
  const { locale, setLocale } = useI18n();
  const next = locale === "en" ? "km" : "en";

  if (variant === "full") {
    return (
      <button
        onClick={() => setLocale(next)}
        className={`flex w-full items-center gap-2 text-left transition-colors hover:text-brand ${className ?? ""}`}
        aria-label={`Switch to ${LOCALE_LABELS[next]}`}
      >
        <Languages className="h-4 w-4" />
        <span>{LOCALE_LABELS[next]}</span>
      </button>
    );
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLocale(next)}
      className={`gap-1.5 px-2 ${className ?? ""}`}
      aria-label={`Switch to ${LOCALE_LABELS[next]}`}
      title={`Switch to ${LOCALE_LABELS[next]}`}
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs font-medium">{LOCALE_SHORT_LABELS[next]}</span>
    </Button>
  );
}
