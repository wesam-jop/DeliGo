import React from 'react';
import { View, StyleSheet } from 'react-native';
import { useLanguage } from '../context/LanguageContext';
import { colors } from '../constants/colors';

const Container = ({ 
  children, 
  style, 
  padding = true,
  backgroundColor,
  ...props 
}) => {
  const { isRTL } = useLanguage();

  return (
    <View
      style={[
        styles.container,
        {
          flexDirection: isRTL ? 'row-reverse' : 'row',
          backgroundColor: backgroundColor || colors.background,
        },
        padding && styles.padding,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  padding: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});

export default Container;

