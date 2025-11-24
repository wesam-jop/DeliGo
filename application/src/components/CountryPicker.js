import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
  Text,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from './CustomText';

// Countries data with flags (using emoji flags for simplicity)
const countries = [
  { code: 'SY', name: 'Syria', nameAr: 'سوريا', dialCode: '+963', flag: '🇸🇾' },
  { code: 'SA', name: 'Saudi Arabia', nameAr: 'السعودية', dialCode: '+966', flag: '🇸🇦' },
  { code: 'AE', name: 'United Arab Emirates', nameAr: 'الإمارات', dialCode: '+971', flag: '🇦🇪' },
  { code: 'JO', name: 'Jordan', nameAr: 'الأردن', dialCode: '+962', flag: '🇯🇴' },
  { code: 'LB', name: 'Lebanon', nameAr: 'لبنان', dialCode: '+961', flag: '🇱🇧' },
  { code: 'IQ', name: 'Iraq', nameAr: 'العراق', dialCode: '+964', flag: '🇮🇶' },
  { code: 'EG', name: 'Egypt', nameAr: 'مصر', dialCode: '+20', flag: '🇪🇬' },
  { code: 'KW', name: 'Kuwait', nameAr: 'الكويت', dialCode: '+965', flag: '🇰🇼' },
  { code: 'QA', name: 'Qatar', nameAr: 'قطر', dialCode: '+974', flag: '🇶🇦' },
  { code: 'BH', name: 'Bahrain', nameAr: 'البحرين', dialCode: '+973', flag: '🇧🇭' },
  { code: 'OM', name: 'Oman', nameAr: 'عمان', dialCode: '+968', flag: '🇴🇲' },
  { code: 'YE', name: 'Yemen', nameAr: 'اليمن', dialCode: '+967', flag: '🇾🇪' },
  { code: 'PS', name: 'Palestine', nameAr: 'فلسطين', dialCode: '+970', flag: '🇵🇸' },
  { code: 'MA', name: 'Morocco', nameAr: 'المغرب', dialCode: '+212', flag: '🇲🇦' },
  { code: 'DZ', name: 'Algeria', nameAr: 'الجزائر', dialCode: '+213', flag: '🇩🇿' },
  { code: 'TN', name: 'Tunisia', nameAr: 'تونس', dialCode: '+216', flag: '🇹🇳' },
  { code: 'LY', name: 'Libya', nameAr: 'ليبيا', dialCode: '+218', flag: '🇱🇾' },
  { code: 'SD', name: 'Sudan', nameAr: 'السودان', dialCode: '+249', flag: '🇸🇩' },
  { code: 'US', name: 'United States', nameAr: 'الولايات المتحدة', dialCode: '+1', flag: '🇺🇸' },
  { code: 'GB', name: 'United Kingdom', nameAr: 'المملكة المتحدة', dialCode: '+44', flag: '🇬🇧' },
  { code: 'FR', name: 'France', nameAr: 'فرنسا', dialCode: '+33', flag: '🇫🇷' },
  { code: 'DE', name: 'Germany', nameAr: 'ألمانيا', dialCode: '+49', flag: '🇩🇪' },
  { code: 'IT', name: 'Italy', nameAr: 'إيطاليا', dialCode: '+39', flag: '🇮🇹' },
  { code: 'ES', name: 'Spain', nameAr: 'إسبانيا', dialCode: '+34', flag: '🇪🇸' },
  { code: 'TR', name: 'Turkey', nameAr: 'تركيا', dialCode: '+90', flag: '🇹🇷' },
  { code: 'IR', name: 'Iran', nameAr: 'إيران', dialCode: '+98', flag: '🇮🇷' },
  { code: 'IN', name: 'India', nameAr: 'الهند', dialCode: '+91', flag: '🇮🇳' },
  { code: 'CN', name: 'China', nameAr: 'الصين', dialCode: '+86', flag: '🇨🇳' },
  { code: 'JP', name: 'Japan', nameAr: 'اليابان', dialCode: '+81', flag: '🇯🇵' },
  { code: 'KR', name: 'South Korea', nameAr: 'كوريا الجنوبية', dialCode: '+82', flag: '🇰🇷' },
  { code: 'RU', name: 'Russia', nameAr: 'روسيا', dialCode: '+7', flag: '🇷🇺' },
  { code: 'CA', name: 'Canada', nameAr: 'كندا', dialCode: '+1', flag: '🇨🇦' },
  { code: 'AU', name: 'Australia', nameAr: 'أستراليا', dialCode: '+61', flag: '🇦🇺' },
  { code: 'BR', name: 'Brazil', nameAr: 'البرازيل', dialCode: '+55', flag: '🇧🇷' },
  { code: 'MX', name: 'Mexico', nameAr: 'المكسيك', dialCode: '+52', flag: '🇲🇽' },
  { code: 'AR', name: 'Argentina', nameAr: 'الأرجنتين', dialCode: '+54', flag: '🇦🇷' },
];

const CountryPicker = ({ 
  visible, 
  onClose, 
  onSelect, 
  selectedCountry = null,
  searchPlaceholder = 'Search country...'
}) => {
  const { language, isRTL } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  // Filter countries based on search query
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    
    const query = searchQuery.toLowerCase().trim();
    return countries.filter((country) => {
      const name = country.name.toLowerCase();
      const nameAr = country.nameAr.toLowerCase();
      const dialCode = country.dialCode.toLowerCase();
      const code = country.code.toLowerCase();
      
      return (
        name.includes(query) ||
        nameAr.includes(query) ||
        dialCode.includes(query) ||
        code.includes(query)
      );
    });
  }, [searchQuery]);

  const handleSearchChange = (text) => {
    setSearchQuery(text);
  };

  const handleSelect = (country) => {
    onSelect(country);
    setSearchQuery('');
    onClose();
  };

  const renderCountryItem = ({ item }) => {
    const isSelected = selectedCountry?.code === item.code;
    const displayName = language === 'ar' ? item.nameAr : item.name;

    return (
      <TouchableOpacity
        style={[
          styles.countryItem,
          isSelected && styles.selectedCountryItem,
          { flexDirection: isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={() => handleSelect(item)}
      >
        <Text style={styles.flag}>{item.flag}</Text>
        <View style={[styles.countryInfo, { marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }]}>
          <CustomText variant="body" color={isSelected ? colors.primary : additionalColors.text} style={styles.countryName}>
            {displayName}
          </CustomText>
          <View style={[styles.dialCodeContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <CustomText variant="caption" color={additionalColors.textLight} style={styles.dialCode}>
              {item.dialCode}
            </CustomText>
          </View>
        </View>
        {isSelected && (
          <Ionicons 
            name="checkmark-circle" 
            size={24} 
            color={colors.primary} 
            style={[styles.checkIcon, { marginLeft: isRTL ? 0 : 'auto', marginRight: isRTL ? 'auto' : 0 }]}
          />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { direction: isRTL ? 'rtl' : 'ltr' }]}>
          {/* Header */}
          <View style={[styles.header, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <CustomText variant="h2" color={colors.primary} style={styles.headerTitle}>
              {language === 'ar' ? 'اختر الدولة' : 'Select Country'}
            </CustomText>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color={additionalColors.text} />
            </TouchableOpacity>
          </View>

          {/* Search Bar */}
          <View style={[styles.searchContainer, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
            <Ionicons 
              name="search" 
              size={20} 
              color={additionalColors.textLight} 
              style={[styles.searchIcon, { marginRight: isRTL ? 0 : 12, marginLeft: isRTL ? 12 : 0 }]}
            />
            <TextInput
              style={[styles.searchInput, { textAlign: isRTL ? 'right' : 'left' }]}
              placeholder={language === 'ar' ? 'ابحث عن الدولة...' : 'Search country...'}
              placeholderTextColor={additionalColors.textLight}
              value={searchQuery}
              onChangeText={handleSearchChange}
              autoFocus
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity
                onPress={() => setSearchQuery('')}
                style={[styles.clearButton, { marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }]}
              >
                <Ionicons name="close-circle" size={20} color={additionalColors.textLight} />
              </TouchableOpacity>
            )}
          </View>

          {/* Countries List */}
          <View style={styles.listContainer}>
            <FlatList
              data={filteredCountries}
              renderItem={renderCountryItem}
              keyExtractor={(item) => item.code}
              style={styles.countriesList}
              contentContainerStyle={filteredCountries.length === 0 ? styles.emptyListContainer : styles.listContent}
              showsVerticalScrollIndicator={false}
              ListEmptyComponent={
                filteredCountries.length === 0 ? (
                  <View style={styles.emptyContainer}>
                    <Ionicons name="search-outline" size={48} color={additionalColors.textLight} />
                    <CustomText variant="body" color={additionalColors.textLight} style={styles.emptyText}>
                      {language === 'ar' ? 'لا توجد نتائج' : 'No results found'}
                    </CustomText>
                  </View>
                ) : null
              }
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '85%',
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: additionalColors.border,
  },
  headerTitle: {
    flex: 1,
  },
  closeButton: {
    padding: 4,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginTop: 16,
    marginBottom: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: additionalColors.divider,
    borderRadius: 12,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: additionalColors.text,
    padding: 0,
  },
  clearButton: {
    padding: 4,
  },
  listContainer: {
    flex: 1,
    minHeight: 200,
  },
  countriesList: {
    flex: 1,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  countryItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: additionalColors.border,
  },
  selectedCountryItem: {
    backgroundColor: additionalColors.divider,
  },
  flag: {
    fontSize: 32,
    width: 40,
    textAlign: 'center',
  },
  countryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  countryName: {
    marginBottom: 4,
  },
  dialCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dialCode: {
    fontWeight: '600',
    fontSize: 13,
  },
  checkIcon: {
    marginLeft: 'auto',
  },
  emptyListContainer: {
    flexGrow: 1,
    justifyContent: 'center',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    marginTop: 16,
  },
});

export default CountryPicker;

