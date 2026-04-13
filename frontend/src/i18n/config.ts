/**
 * i18n Configuration Constants
 * Centralized configuration for internationalization settings
 */

export const SUPPORTED_LANGUAGES = ['en', 'ar'] as const;
export type SupportedLanguage = typeof SUPPORTED_LANGUAGES[number];

export const DEFAULT_LANGUAGE: SupportedLanguage = 'en';
export const FALLBACK_LANGUAGE: SupportedLanguage = 'en';

// Language metadata
export const LANGUAGE_CONFIG: Record<SupportedLanguage, {
    name: string;
    nativeName: string;
    dir: 'ltr' | 'rtl';
    flag: string;
}> = {
    en: {
        name: 'English',
        nativeName: 'English',
        dir: 'ltr',
        flag: '🇺🇸'
    },
    ar: {
        name: 'Arabic',
        nativeName: 'العربية',
        dir: 'rtl',
        flag: '🇸🇦'
    }
};

// Translation namespaces
export const NAMESPACES = [
    'common',
    'auth',
    'navigation',
    'dashboard',
    'requests',
    'hospitals',
    'ambulances',
    'users',
    'validation',
    'settings',
    'notifications'
] as const;

export type Namespace = typeof NAMESPACES[number];

export const DEFAULT_NAMESPACE: Namespace = 'common';

// LocalStorage key for persisting language preference
export const LANGUAGE_STORAGE_KEY = 'rescufy_language';
