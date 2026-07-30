"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import en from "@/messages/en";
import fa from "@/messages/fa";

type Messages = typeof en;
type Locale = "en" | "fa" | "ar" | "ru" | "zh" | "es";

// نقشه زبان به locale استاندار
const localeMap: Record<Locale, string> = {
  en: "en-US",
  fa: "fa-IR",
  ar: "ar-SA",
  ru: "ru-RU",
  zh: "zh-CN",
  es: "es-ES",
};

// نقشه زبان به واحد پول
const currencyMap: Record<Locale, string> = {
  en: "USD",
  fa: "IRR",
  ar: "SAR",
  ru: "RUB",
  zh: "CNY",
  es: "EUR",
};

const USD_TO_TOMAN = 60000;

const translations: Record<string, Messages> = {
  en,
  fa: fa as unknown as Messages,
  ar: en as Messages,
  ru: en as Messages,
  zh: en as Messages,
  es: en as Messages,
};

const rtlLocales: Locale[] = ["fa", "ar"];

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Messages;
  isRtl: boolean;
  dir: "ltr" | "rtl";
  /** قیمت رو بر اساس locale فعلی فرمت می‌کنه */
  formatCurrency: (amount: number, currency?: string, priceToman?: number | null) => string;
  /** تاریخ رو بر اساس locale فعلی فرمت می‌کنه */
  formatDate: (date: Date | string | number, options?: Intl.DateTimeFormatOptions) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("locale") as Locale;
    if (stored && translations[stored]) {
      setLocaleState(stored);
    }
    setMounted(true);
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    document.documentElement.lang = newLocale;
    document.documentElement.dir = rtlLocales.includes(newLocale) ? "rtl" : "ltr";
  }, []);

  useEffect(() => {
    if (mounted) {
      document.documentElement.lang = locale;
      document.documentElement.dir = rtlLocales.includes(locale) ? "rtl" : "ltr";
    }
  }, [locale, mounted]);

  const isRtl = rtlLocales.includes(locale);

  const formatCurrency = useCallback(
    (amount: number, currency?: string, priceToman?: number | null): string => {
      const resolvedCurrency = currency || currencyMap[locale];
      if (locale === "fa") {
        if (priceToman && priceToman > 0) {
          return `${priceToman.toLocaleString("fa-IR")} تومان`;
        }
        const toman = Math.round(amount * USD_TO_TOMAN);
        return `${toman.toLocaleString("fa-IR")} تومان`;
      }
      try {
        return new Intl.NumberFormat(localeMap[locale], {
          style: "currency",
          currency: resolvedCurrency,
          maximumFractionDigits: 0,
        }).format(amount);
      } catch {
        return `${resolvedCurrency} ${amount.toLocaleString()}`;
      }
    },
    [locale]
  );

  const formatDate = useCallback(
    (
      date: Date | string | number,
      options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "long",
        day: "numeric",
      }
    ): string => {
      try {
        return new Intl.DateTimeFormat(localeMap[locale], options).format(
          new Date(date)
        );
      } catch {
        return String(date);
      }
    },
    [locale]
  );

  const value: I18nContextType = {
    locale,
    setLocale,
    t: translations[locale] || translations.en,
    isRtl,
    dir: isRtl ? "rtl" : "ltr",
    formatCurrency,
    formatDate,
  };

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
}

export function useTranslation() {
  return useI18n();
}
