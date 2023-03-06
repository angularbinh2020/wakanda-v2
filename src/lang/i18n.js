import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import vi from "./vi";

const resources = {
  vi: {
    translation: vi,
  },
};

i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "vi",
    fallbackLng: "vi",
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
    react: {
      transKeepBasicHtmlNodesFor: ["br", "strong", "i", "p", "li"],
    },
  });

export default i18n;
