import React from 'react';
import { Text, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';

const CustomText = ({ 
  children, 
  style, 
  translate = false, 
  translationKey = '',
  variant = 'body',
  color,
  ...props 
}) => {
  const { t, isRTL } = useLanguage();
  
  const textContent = translate && translationKey ? t(translationKey) : children;
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'h1':
        return styles.h1;
      case 'h2':
        return styles.h2;
      case 'h3':
        return styles.h3;
      case 'body':
        return styles.body;
      case 'caption':
        return styles.caption;
      case 'small':
        return styles.small;
      default:
        return styles.body;
    }
  };

  return (
    <Text
      style={[
        getVariantStyles(),
        { 
          color: color || additionalColors.text,
          textAlign: isRTL ? 'right' : 'left',
        },
        style,
      ]}
      {...props}
    >
      {textContent}
    </Text>
  );
};

const styles = StyleSheet.create({
  h1: {
    fontSize: 32,
    lineHeight: 40,
    fontFamily: 'Cairo-Bold',
  },
  h2: {
    fontSize: 24,
    lineHeight: 32,
    fontFamily: 'Cairo-Bold',
  },
  h3: {
    fontSize: 20,
    lineHeight: 28,
    fontFamily: 'Cairo-SemiBold',
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: 'Cairo-Regular',
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
    fontFamily: 'Cairo-Regular',
  },
  small: {
    fontSize: 12,
    lineHeight: 16,
    fontFamily: 'Cairo-Regular',
  },
});

export default CustomText;

