const SUPPORTED_LOCALES = ['ar', 'en'];
const LOCALE_STORAGE_KEY = 'preferred_locale';

const isBrowser = () => typeof window !== 'undefined';
const hasDocument = () => typeof document !== 'undefined';

export const isRTL = (locale = 'ar') => locale === 'ar';

export const getStoredLocale = () => {
    if (!isBrowser()) {
        return null;
    }

    try {
        const stored = window.localStorage.getItem(LOCALE_STORAGE_KEY);
        return SUPPORTED_LOCALES.includes(stored) ? stored : null;
    } catch (error) {
        console.warn('Unable to read preferred locale from storage', error);
        return null;
    }
};

export const persistLocalePreference = (locale) => {
    if (!isBrowser() || !SUPPORTED_LOCALES.includes(locale)) {
        return;
    }

    try {
        window.localStorage.setItem(LOCALE_STORAGE_KEY, locale);
    } catch (error) {
        console.warn('Unable to persist preferred locale', error);
    }
};

export const applyDirection = (locale = 'ar') => {
    if (!hasDocument()) {
        return;
    }

    const resolvedLocale = SUPPORTED_LOCALES.includes(locale) ? locale : 'ar';
    const rtl = isRTL(resolvedLocale);
    const html = document.documentElement;
    const body = document.body;

    html?.setAttribute('lang', resolvedLocale);
    html?.setAttribute('dir', rtl ? 'rtl' : 'ltr');

    if (body) {
        body.setAttribute('dir', rtl ? 'rtl' : 'ltr');
        body.classList.toggle('font-cairo', rtl);
        body.classList.toggle('rtl', rtl);
        body.classList.toggle('ltr', !rtl);
    }
};

export const syncDirectionWithStoredLocale = () => {
    const storedLocale = getStoredLocale();
    if (storedLocale) {
        applyDirection(storedLocale);
    }
};

export const LOCALE_UTILS = {
    SUPPORTED_LOCALES,
    LOCALE_STORAGE_KEY,
};

