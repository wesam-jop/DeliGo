import React, { useState } from 'react';
import { router } from '@inertiajs/react';
import { Globe, ChevronDown } from 'lucide-react';
import { persistLocalePreference, applyDirection } from '../utils/locale';

export default function LanguageSwitcher({ currentLocale }) {
    const [isOpen, setIsOpen] = useState(false);
    const isRTL = currentLocale === 'ar';

    const handleLocaleSelect = (locale) => {
        persistLocalePreference(locale);
        applyDirection(locale);
        setIsOpen(false);

        router.visit(`/language/${locale}`, {
            preserveScroll: true,
            onFinish: () => {
                if (typeof window !== 'undefined') {
                    window.location.reload();
                }
            },
        });
    };

    return (
        <div className="relative" dir={isRTL ? 'rtl' : 'ltr'}>
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 text-slate-700 hover:text-purple-600 transition-colors px-3 py-2 rounded-lg hover:bg-slate-50"
            >
                <Globe className="w-5 h-5" />
                <span className="text-sm font-medium">
                    {currentLocale === 'ar' ? 'العربية' : 'English'}
                </span>
                <ChevronDown className="w-4 h-4" />
            </button>
            
            {isOpen && (
                <div className={`absolute ${isRTL ? 'left-0' : 'right-0'} mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-50`}>
                    <div className="py-1">
                        <button
                            type="button"
                            onClick={() => handleLocaleSelect('ar')}
                            className={`w-full flex items-center px-4 py-2 text-sm hover:bg-slate-100 transition-colors ${
                                currentLocale === 'ar' ? 'bg-purple-50 text-purple-600' : 'text-slate-700'
                            } ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                        >
                            <span className={isRTL ? 'ml-2' : 'mr-2'}>🇸🇦</span>
                            <span>العربية</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => handleLocaleSelect('en')}
                            className={`w-full flex items-center px-4 py-2 text-sm hover:bg-slate-100 transition-colors ${
                                currentLocale === 'en' ? 'bg-purple-50 text-purple-600' : 'text-slate-700'
                            } ${isRTL ? 'flex-row-reverse text-right' : ''}`}
                        >
                            <span className={isRTL ? 'ml-2' : 'mr-2'}>🇺🇸</span>
                            <span>English</span>
                        </button>
                    </div>
                </div>
            )}
            
            {/* Overlay to close dropdown when clicking outside */}
            {isOpen && (
                <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsOpen(false)}
                />
            )}
        </div>
    );
}
