// قائمة رموز الدول العربية والأكثر استخداماً
export interface Country {
  code: string;
  name: string;
  dialCode: string;
  flag: string;
}

export const countries: Country[] = [
  { code: 'SY', name: 'سوريا', dialCode: '+963', flag: '🇸🇾' },
  { code: 'SA', name: 'السعودية', dialCode: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'الإمارات', dialCode: '+971', flag: '🇦🇪' },
  { code: 'KW', name: 'الكويت', dialCode: '+965', flag: '🇰🇼' },
  { code: 'QA', name: 'قطر', dialCode: '+974', flag: '🇶🇦' },
  { code: 'BH', name: 'البحرين', dialCode: '+973', flag: '🇧🇭' },
  { code: 'OM', name: 'عمان', dialCode: '+968', flag: '🇴🇲' },
  { code: 'IQ', name: 'العراق', dialCode: '+964', flag: '🇮🇶' },
  { code: 'JO', name: 'الأردن', dialCode: '+962', flag: '🇯🇴' },
  { code: 'LB', name: 'لبنان', dialCode: '+961', flag: '🇱🇧' },
  { code: 'EG', name: 'مصر', dialCode: '+20', flag: '🇪🇬' },
  { code: 'YE', name: 'اليمن', dialCode: '+967', flag: '🇾🇪' },
  { code: 'LY', name: 'ليبيا', dialCode: '+218', flag: '🇱🇾' },
  { code: 'TN', name: 'تونس', dialCode: '+216', flag: '🇹🇳' },
  { code: 'DZ', name: 'الجزائر', dialCode: '+213', flag: '🇩🇿' },
  { code: 'MA', name: 'المغرب', dialCode: '+212', flag: '🇲🇦' },
  { code: 'SD', name: 'السودان', dialCode: '+249', flag: '🇸🇩' },
  { code: 'US', name: 'الولايات المتحدة', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'بريطانيا', dialCode: '+44', flag: '🇬🇧' },
  { code: 'FR', name: 'فرنسا', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'ألمانيا', dialCode: '+49', flag: '🇩🇪' },
  { code: 'TR', name: 'تركيا', dialCode: '+90', flag: '🇹🇷' },
];

export const getCountryByCode = (code: string): Country | undefined => {
  return countries.find(c => c.code === code || c.dialCode === code);
};

export const defaultCountry: Country = countries[0]; // سوريا

