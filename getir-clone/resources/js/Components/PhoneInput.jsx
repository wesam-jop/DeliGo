import React, { useState, useRef, useEffect } from 'react';
import { Phone, ChevronDown, Check, X } from 'lucide-react';
import { parsePhoneNumber, isValidPhoneNumber, getCountryCallingCode } from 'libphonenumber-js';

const countries = [
    { code: 'SY', name: 'Syria', flag: '🇸🇾', callingCode: '+963' },
    { code: 'SA', name: 'Saudi Arabia', flag: '🇸🇦', callingCode: '+966' },
    { code: 'AE', name: 'UAE', flag: '🇦🇪', callingCode: '+971' },
    { code: 'EG', name: 'Egypt', flag: '🇪🇬', callingCode: '+20' },
    { code: 'JO', name: 'Jordan', flag: '🇯🇴', callingCode: '+962' },
    { code: 'LB', name: 'Lebanon', flag: '🇱🇧', callingCode: '+961' },
    { code: 'KW', name: 'Kuwait', flag: '🇰🇼', callingCode: '+965' },
    { code: 'QA', name: 'Qatar', flag: '🇶🇦', callingCode: '+974' },
    { code: 'BH', name: 'Bahrain', flag: '🇧🇭', callingCode: '+973' },
    { code: 'OM', name: 'Oman', flag: '🇴🇲', callingCode: '+968' },
    { code: 'IQ', name: 'Iraq', flag: '🇮🇶', callingCode: '+964' },
    { code: 'US', name: 'United States', flag: '🇺🇸', callingCode: '+1' },
    { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', callingCode: '+44' },
    { code: 'FR', name: 'France', flag: '🇫🇷', callingCode: '+33' },
    { code: 'DE', name: 'Germany', flag: '🇩🇪', callingCode: '+49' },
];

export default function PhoneInput({ 
    value = '', 
    onChange, 
    onValidationChange,
    placeholder = 'Enter phone number',
    className = '',
    error = null,
    disabled = false
}) {
    const [selectedCountry, setSelectedCountry] = useState(countries[0]);
    const [phoneNumber, setPhoneNumber] = useState('');
    const [isValid, setIsValid] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const dropdownRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        if (value) {
            try {
                const parsed = parsePhoneNumber(value);
                if (parsed) {
                    const country = countries.find(c => c.code === parsed.country);
                    if (country) {
                        setSelectedCountry(country);
                        setPhoneNumber(parsed.nationalNumber);
                    }
                }
            } catch (error) {
                // Handle invalid phone number
            }
        }
    }, [value]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleCountrySelect = (country) => {
        setSelectedCountry(country);
        setIsDropdownOpen(false);
        const fullNumber = country.callingCode + phoneNumber;
        onChange(fullNumber);
        validatePhoneNumber(fullNumber);
    };

    const handlePhoneChange = (e) => {
        const inputValue = e.target.value.replace(/\D/g, ''); // Remove non-digits
        setPhoneNumber(inputValue);
        const fullNumber = selectedCountry.callingCode + inputValue;
        onChange(fullNumber);
        validatePhoneNumber(fullNumber);
    };

    const validatePhoneNumber = (number) => {
        try {
            console.log('Validating phone number:', number);
            const isValidNumber = isValidPhoneNumber(number);
            console.log('Is valid:', isValidNumber);
            setIsValid(isValidNumber);
            onValidationChange?.(isValidNumber);
        } catch (error) {
            console.log('Validation error:', error);
            setIsValid(false);
            onValidationChange?.(false);
        }
    };

    const formatPhoneNumber = (number) => {
        if (!number) return '';
        try {
            const parsed = parsePhoneNumber(number);
            return parsed ? parsed.formatNational() : number;
        } catch (error) {
            return number;
        }
    };

    return (
        <div className={`relative ${className}`}>
            <div className={`relative flex items-center border rounded-lg transition-all duration-200 ${
                error 
                    ? 'border-red-300 focus-within:border-red-500 focus-within:ring-2 focus-within:ring-red-200' 
                    : isValid 
                        ? 'border-green-300 focus-within:border-green-500 focus-within:ring-2 focus-within:ring-green-200'
                        : isFocused
                            ? 'border-purple-500 focus-within:ring-2 focus-within:ring-purple-200'
                            : 'border-gray-300 focus-within:border-purple-500 focus-within:ring-2 focus-within:ring-purple-200'
            } ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}`}>
                
                {/* Country Selector */}
                <button
                    type="button"
                    onClick={() => !disabled && setIsDropdownOpen(!isDropdownOpen)}
                    disabled={disabled}
                    className="flex items-center px-3 py-2 border-r border-gray-300 hover:bg-gray-50 focus:outline-none focus:bg-gray-50 disabled:cursor-not-allowed"
                >
                    <span className="text-lg mr-2">{selectedCountry.flag}</span>
                    <span className="text-sm font-medium text-gray-700">{selectedCountry.callingCode}</span>
                    <ChevronDown className={`w-4 h-4 ml-1 text-gray-500 transition-transform duration-200 ${
                        isDropdownOpen ? 'rotate-180' : ''
                    }`} />
                </button>

                {/* Phone Input */}
                <div className="flex-1 flex items-center">
                    <Phone className="w-5 h-5 text-gray-400 ml-3" />
                    <input
                        ref={inputRef}
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        placeholder={placeholder}
                        disabled={disabled}
                        className="flex-1 px-3 py-2 border-0 focus:ring-0 focus:outline-none disabled:bg-transparent disabled:cursor-not-allowed"
                    />
                    
                    {/* Validation Icon */}
                    {phoneNumber && (
                        <div className="px-3">
                            {isValid ? (
                                <Check className="w-5 h-5 text-green-500" />
                            ) : (
                                <X className="w-5 h-5 text-red-500" />
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Country Dropdown */}
            {isDropdownOpen && (
                <div 
                    ref={dropdownRef}
                    className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto"
                >
                    {countries.map((country) => (
                        <button
                            key={country.code}
                            type="button"
                            onClick={() => handleCountrySelect(country)}
                            className={`w-full flex items-center px-4 py-2 text-left hover:bg-gray-50 ${
                                selectedCountry.code === country.code ? 'bg-purple-50 text-purple-700' : 'text-gray-700'
                            }`}
                        >
                            <span className="text-lg mr-3">{country.flag}</span>
                            <span className="flex-1 text-sm font-medium">{country.name}</span>
                            <span className="text-sm text-gray-500">{country.callingCode}</span>
                        </button>
                    ))}
                </div>
            )}

            {/* Error Message */}
            {error && (
                <p className="mt-1 text-sm text-red-600 flex items-center">
                    <X className="w-4 h-4 mr-1" />
                    {error}
                </p>
            )}

            {/* Success Message */}
            {isValid && phoneNumber && (
                <p className="mt-1 text-sm text-green-600 flex items-center">
                    <Check className="w-4 h-4 mr-1" />
                    Valid phone number
                </p>
            )}
        </div>
    );
}
