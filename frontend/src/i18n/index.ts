/**
 * i18n Initialization
 * Main configuration for react-i18next
 */

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import {
  DEFAULT_LANGUAGE,
  FALLBACK_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  SUPPORTED_LANGUAGES,
  DEFAULT_NAMESPACE,
} from "./config";

// Import all English translations
import enCommon from "../locales/en/common.json";
import enAuth from "../locales/en/auth.json";
import enNavigation from "../locales/en/navigation.json";
import enDashboard from "../locales/en/dashboard.json";
import enRequests from "../locales/en/requests.json";
import enHospitals from "../locales/en/hospitals.json";
import enAmbulances from "../locales/en/ambulances.json";
import enUsers from "../locales/en/users.json";
import enValidation from "../locales/en/validation.json";
import enSettings from "../locales/en/settings.json";

// Import all Arabic translations
import arCommon from "../locales/ar/common.json";
import arAuth from "../locales/ar/auth.json";
import arNavigation from "../locales/ar/navigation.json";
import arDashboard from "../locales/ar/dashboard.json";
import arRequests from "../locales/ar/requests.json";
import arHospitals from "../locales/ar/hospitals.json";
import arAmbulances from "../locales/ar/ambulances.json";
import arUsers from "../locales/ar/users.json";
import arValidation from "../locales/ar/validation.json";
import arSettings from "../locales/ar/settings.json";
import { set } from "zod";

// Resources object containing all translations
const resources = {
  en: {
    common: enCommon,
    auth: enAuth,
    navigation: enNavigation,
    dashboard: enDashboard,
    requests: enRequests,
    hospitals: enHospitals,
    ambulances: enAmbulances,
    users: enUsers,
    validation: enValidation,
    settings: enSettings,
  },
  ar: {
    common: arCommon,
    auth: arAuth,
    navigation: arNavigation,
    dashboard: arDashboard,
    requests: arRequests,
    hospitals: arHospitals,
    ambulances: arAmbulances,
    users: arUsers,
    validation: arValidation,
    settings: arSettings,
  },
};

i18n
  // Detect user language
  .use(LanguageDetector)
  // Pass i18n instance to react-i18next
  .use(initReactI18next)
  // Initialize i18next
  .init({
    resources,
    fallbackLng: FALLBACK_LANGUAGE,
    lng: localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE,
    supportedLngs: SUPPORTED_LANGUAGES as unknown as string[],

    // Default namespace
    defaultNS: DEFAULT_NAMESPACE,
    ns: [
      "common",
      "auth",
      "navigation",
      "dashboard",
      "requests",
      "hospitals",
      "ambulances",
      "users",
      "validation",
      "settings",
    ],

    // Language detection options
    detection: {
      order: ["localStorage", "navigator", "htmlTag"],
      lookupLocalStorage: LANGUAGE_STORAGE_KEY,
      caches: ["localStorage"],
    },

    // Interpolation settings
    interpolation: {
      escapeValue: false, // React already escapes by default
    },

    // React specific options
    react: {
      useSuspense: false, // Disable suspense for SSR compatibility
    },

    // Debug mode (disable in production)
    debug: import.meta.env.DEV,
  });

export default i18n;
