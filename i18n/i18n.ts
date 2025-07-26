import i18n from "i18next";
import type { InitOptions } from "i18next";

import { ptBR, esES, enUS } from "./locales";

const options: InitOptions = {
  resources: {
    "en-US": enUS,
    "pt-BR": ptBR,
    "es-ES": esES,
  },
  lng: "pt-BR",
  fallbackLng: "pt-BR",
  interpolation: {
    escapeValue: false,
  },
};

if (!i18n.isInitialized) {
  i18n.init(options);
}

export default i18n;
