import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import zh from "./locales/zh.json";

const resources = {
  en: {
    translation: en,
  },
  zh: {
    translation: zh,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    react: {
      useSuspense: false, // Disable suspense for better compatibility
    },
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: "i18nextLng",
      caches: ["localStorage"],
    },
    // Map browser language codes to our supported languages
    supportedLngs: ["en", "zh"],
    load: "languageOnly", // Load 'zh' for 'zh-CN', 'zh-TW', etc.
    cleanCode: true, // Clean language codes
    // Custom language detection function
    preload: false,
    // Override language detection to handle Chinese variants
    lng: (() => {
      const browserLang = navigator.language || navigator.languages?.[0] || "en";
      // Check if browser language starts with 'zh' (Chinese)
      if (browserLang.toLowerCase().startsWith("zh")) {
        return "zh";
      }
      return "en";
    })(),
  });

export default i18n;
