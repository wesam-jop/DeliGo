import React from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';

/**
 * مكون TextInput موحد باستخدام خط Cairo
 * يطبق RTL تلقائياً
 */
export const TextInput = ({ style, ...props }: TextInputProps) => {
  return (
    <RNTextInput
      {...props}
      style={[
        styles.defaultInput,
        style,
      ]}
      textAlign="right"
    />
  );
};

const styles = StyleSheet.create({
  defaultInput: {
    fontFamily: 'Cairo_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
  },
});

