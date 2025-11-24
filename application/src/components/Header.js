import React from 'react';
import { View, TouchableOpacity, StyleSheet, Platform, StatusBar } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from './CustomText';

const Header = () => {
  const { language, changeLanguage, t, isRTL } = useLanguage();

  const toggleLanguage = () => {
    const newLanguage = language === 'ar' ? 'en' : 'ar';
    changeLanguage(newLanguage);
  };

  return (
    <View 
      key={language} 
      style={[
        styles.header, 
        { 
          flexDirection: isRTL ? 'row-reverse' : 'row',
        }
      ]}
    >
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      
      {/* App Name */}
      <View 
        style={[
          styles.appNameContainer, 
          { 
            alignItems: isRTL ? 'flex-end' : 'flex-start',
          }
        ]}
      >
        <CustomText 
          style={styles.appName}
          translate={true}
          translationKey="appName"
          color={colors.background}
          variant="h2"
        />
      </View>

      {/* Language Switcher Button */}
      <TouchableOpacity 
        style={styles.languageButton} 
        onPress={toggleLanguage}
        activeOpacity={0.7}
      >
        <CustomText 
          style={styles.languageButtonText}
          color={colors.background}
          variant="caption"
        >
          {language === 'ar' ? 'EN' : 'AR'}
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 50,
    paddingBottom: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'space-between',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  appNameContainer: {
    flex: 1,
  },
  appName: {
    letterSpacing: 0.5,
  },
  languageButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    minWidth: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  languageButtonText: {
    // Font is handled by CustomText component
    letterSpacing: 0.5,
  },
});

export default Header;

