import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from './CustomText';
import CountryPicker from './CountryPicker';

const CountrySelectInput = ({ 
  selectedCountry, 
  onSelect, 
  placeholder,
  error 
}) => {
  const { language, isRTL } = useLanguage();
  const [isPickerVisible, setIsPickerVisible] = useState(false);

  const displayText = selectedCountry
    ? `${selectedCountry.flag} ${language === 'ar' ? selectedCountry.nameAr : selectedCountry.name} ${selectedCountry.dialCode}`
    : placeholder || (language === 'ar' ? 'اختر الدولة' : 'Select Country');

  return (
    <View>
      <TouchableOpacity
        style={[
          styles.container,
          error && styles.errorContainer,
          { flexDirection: isRTL ? 'row-reverse' : 'row' }
        ]}
        onPress={() => setIsPickerVisible(true)}
        activeOpacity={0.7}
      >
        <View style={[styles.content, { flexDirection: isRTL ? 'row-reverse' : 'row' }]}>
          {selectedCountry ? (
            <>
              <CustomText variant="body" style={styles.flagText}>
                {selectedCountry.flag}
              </CustomText>
              <View style={[styles.textContainer, { marginLeft: isRTL ? 0 : 12, marginRight: isRTL ? 12 : 0 }]}>
                <CustomText 
                  variant="body" 
                  color={additionalColors.text}
                  numberOfLines={1}
                >
                  {language === 'ar' ? selectedCountry.nameAr : selectedCountry.name}
                </CustomText>
                <CustomText variant="caption" color={additionalColors.textLight}>
                  {selectedCountry.dialCode}
                </CustomText>
              </View>
            </>
          ) : (
            <CustomText variant="body" color={additionalColors.textLight}>
              {displayText}
            </CustomText>
          )}
        </View>
        <Ionicons 
          name="chevron-down" 
          size={20} 
          color={additionalColors.textLight}
          style={[styles.chevron, { marginLeft: isRTL ? 0 : 8, marginRight: isRTL ? 8 : 0 }]}
        />
      </TouchableOpacity>

      {error && (
        <CustomText variant="caption" color={additionalColors.error} style={styles.errorText}>
          {error}
        </CustomText>
      )}

      <CountryPicker
        visible={isPickerVisible}
        onClose={() => setIsPickerVisible(false)}
        onSelect={onSelect}
        selectedCountry={selectedCountry}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: additionalColors.divider,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: additionalColors.border,
    minHeight: 56,
  },
  errorContainer: {
    borderColor: colors.error,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  flagText: {
    fontSize: 24,
  },
  textContainer: {
    flex: 1,
    marginLeft: 12,
  },
  chevron: {
    marginLeft: 8,
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CountrySelectInput;

