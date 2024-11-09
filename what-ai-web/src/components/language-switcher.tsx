"use client";

import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";

const LANGUAGES = [
  { code: "en", name: "English" },
  { code: "fr", name: "French" },
];

export default function LanguageSwitcher() {
  const { i18n, ready } = useTranslation();

  const handleLanguageChange = (langCode: string) => {
    i18n.changeLanguage(langCode);
    localStorage.setItem("language", langCode);
  };

  return (
    <div className="flex gap-2">
      {ready && LANGUAGES.map((lang) => (
        <Button
          key={lang.code}
          variant={i18n.language === lang.code ? "default" : "outline"}
          onClick={() => handleLanguageChange(lang.code)}
        >
          {lang.name}
        </Button>
      ))}
    </div>
  );
}
