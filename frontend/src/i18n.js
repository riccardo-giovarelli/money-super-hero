import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import { it } from "@languages/it";
import { en } from "@languages/en";

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        debug: false,
        fallbackLng: 'en',
        resources: { en, it },
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;