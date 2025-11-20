import { useMemo } from 'react';
import { usePage } from '@inertiajs/react';

const DATE_FORMATTERS = {
    'Y-m-d': ({ year, month, day }) => `${year}-${month}-${day}`,
    'd/m/Y': ({ year, month, day }) => `${day}/${month}/${year}`,
    'm/d/Y': ({ year, month, day }) => `${month}/${day}/${year}`,
    'd-m-Y': ({ year, month, day }) => `${day}-${month}-${year}`,
};

const pad = (value) => String(value).padStart(2, '0');

const getZonedDate = (value, timeZone) => {
    if (!value) return null;
    const date = value instanceof Date ? value : new Date(value);
    if (Number.isNaN(date.getTime())) {
        return null;
    }

    // Convert to the desired timezone by leveraging locale string
    const localeDateString = date.toLocaleString('en-US', {
        timeZone: timeZone || 'Asia/Damascus',
    });

    const zonedDate = new Date(localeDateString);
    return Number.isNaN(zonedDate.getTime()) ? null : zonedDate;
};

export function useGeneralSettings() {
    const { props } = usePage();
    const settings = props?.settings || {};
    const locale = props?.locale === 'en' ? 'en-US' : 'ar-SY';

    const dateFormat = settings.date_format || 'Y-m-d';
    const timeFormat = settings.time_format || 'H:i';
    const timeZone = settings.timezone || 'Asia/Damascus';
    const currency = settings.default_currency || 'SYP';

    const formatDate = (value, customFormat) => {
        const date = getZonedDate(value, timeZone);
        if (!date) return '';

        const parts = {
            year: date.getFullYear(),
            month: pad(date.getMonth() + 1),
            day: pad(date.getDate()),
        };

        const formatter = DATE_FORMATTERS[customFormat || dateFormat] || DATE_FORMATTERS['Y-m-d'];
        return formatter(parts);
    };

    const formatTime = (value, customFormat) => {
        const date = getZonedDate(value, timeZone);
        if (!date) return '';

        const format = customFormat || timeFormat;
        let hours = date.getHours();
        const minutes = pad(date.getMinutes());

        if (format === 'h:i A') {
            const suffix = hours >= 12 ? 'PM' : 'AM';
            const normalizedHours = hours % 12 || 12;
            return `${pad(normalizedHours)}:${minutes} ${suffix}`;
        }

        return `${pad(hours)}:${minutes}`;
    };

    const formatDateTime = (value) => {
        const datePart = formatDate(value);
        const timePart = formatTime(value);
        if (!datePart && !timePart) {
            return '';
        }

        if (!timePart) return datePart;
        return `${datePart} ${timePart}`;
    };

    const formatCurrency = (value, options = {}) => {
        const numericValue = Number(value);
        if (!Number.isFinite(numericValue)) {
            return value ?? '';
        }

        const currencyCode = (currency || '').toUpperCase();

        try {
            if (/^[A-Z]{3}$/.test(currencyCode)) {
                return new Intl.NumberFormat(locale, {
                    style: 'currency',
                    currency: currencyCode,
                    minimumFractionDigits: options.minimumFractionDigits ?? 0,
                    maximumFractionDigits: options.maximumFractionDigits ?? 2,
                }).format(numericValue);
            }
        } catch (error) {
            // Fallback to manual formatting
        }

        return `${numericValue.toLocaleString(locale, {
            minimumFractionDigits: options.minimumFractionDigits ?? 0,
            maximumFractionDigits: options.maximumFractionDigits ?? 2,
        })} ${currency}`;
    };

    return useMemo(
        () => ({
            settings,
            formatDate,
            formatTime,
            formatDateTime,
            formatCurrency,
        }),
        [settings, dateFormat, timeFormat, timeZone, currency, locale]
    );
}

