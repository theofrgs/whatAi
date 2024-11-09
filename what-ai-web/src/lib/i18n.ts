"use client";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import enJson from "../locales/en.json";
import frJson from "../locales/fr.json";

const resources = {
  en: {
    translation: enJson,
  },
  fr: {
    translation: frJson,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ["cookie", "localStorage", "navigator"],
      caches: ["cookie", "localStorage"],
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
