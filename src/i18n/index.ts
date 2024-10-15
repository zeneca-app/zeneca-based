import { getLocales } from "expo-localization";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import zustandStorage from "../storage/storage";
import translationEn from "./locales/en/translation.json";
import translationEs from "./locales/es/translation.json";

const resources = {
  es: { translation: translationEs },
  en: { translation: translationEn },
};

const initI18n = async () => {
  let savedLanguage = await zustandStorage.getItem("language");

  const response = getLocales()[0];
  if (!savedLanguage || response.languageCode !== savedLanguage) {
    if (response.languageCode) {
      await zustandStorage.setItem("language", response.languageCode);
      savedLanguage = response.languageCode;
    }
  }

  i18n.use(initReactI18next).init({
    compatibilityJSON: "v3",
    resources,
    lng: savedLanguage ?? "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });
};

initI18n();

export default i18n;
