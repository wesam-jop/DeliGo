import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { Globe, ChevronDown } from 'lucide-react';
import { persistLocalePreference, applyDirection } from '../utils/locale';

export default function LanguageSwitcher({ currentLocale }) {
    const [isOpen, setIsOpen] = useState(false);

    const handleLocaleSelect = (locale) => {
        persistLocalePreference(locale);
        applyDirection(locale);
        setIsOpen(false);
    };

    return (
        <div className="relative">
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
                <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg border border-slate-200 z-50">
                    <div className="py-1">
                        <Link
                            href="/language/ar"
                            onClick={() => handleLocaleSelect('ar')}
                            className={`flex items-center px-4 py-2 text-sm hover:bg-slate-100 transition-colors ${
                                currentLocale === 'ar' ? 'bg-purple-50 text-purple-600' : 'text-slate-700'
                            }`}
                        >
                            <span className="mr-2">🇸🇦</span>
                            <span>العربية</span>
                        </Link>
                        <Link
                            href="/language/en"
                            onClick={() => handleLocaleSelect('en')}
                            className={`flex items-center px-4 py-2 text-sm hover:bg-slate-100 transition-colors ${
                                currentLocale === 'en' ? 'bg-purple-50 text-purple-600' : 'text-slate-700'
                            }`}
                        >
                            <span className="mr-2">🇺🇸</span>
                            <span>English</span>
                        </Link>
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
