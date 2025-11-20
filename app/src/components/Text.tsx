import React from 'react';
import { Text as RNText, TextProps, StyleSheet } from 'react-native';

/**
 * مكون نص موحد باستخدام خط Cairo
 * يطبق RTL تلقائياً
 * لا يؤثر على الأيقونات من @expo/vector-icons
 */
export const Text = ({ style, className, ...props }: TextProps & { className?: string }) => {
  // التأكد من أن الخط يطبق دائماً
  const finalStyle = [
    styles.defaultText,
    style,
  ];

  return (
    <RNText
      {...props}
      className={className}
      style={finalStyle}
    />
  );
};

const styles = StyleSheet.create({
  defaultText: {
    fontFamily: 'Cairo_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

