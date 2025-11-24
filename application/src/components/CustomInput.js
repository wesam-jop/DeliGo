import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useLanguage } from '../context/LanguageContext';
import { colors, additionalColors } from '../constants/colors';
import CustomText from './CustomText';

const CustomInput = ({
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  autoCapitalize = 'none',
  style,
  error,
  translate = false,
  translationKey = '',
  leftIcon,
  rightIcon,
  editable = true,
  ...props
}) => {
  const { t, isRTL } = useLanguage();
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const placeholderText = translate && translationKey ? t(translationKey) : placeholder;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.inputContainer,
          isFocused && styles.inputContainerFocused,
          error && styles.inputContainerError,
          { flexDirection: isRTL ? 'row-reverse' : 'row' },
          style,
        ]}
      >
        {leftIcon && (
          <View style={[styles.iconContainer, { marginRight: isRTL ? 0 : 8, marginLeft: isRTL ? 8 : 0 }]}>
            {leftIcon}
          </View>
        )}
        
        <TextInput
          style={[
            styles.input,
            { textAlign: isRTL ? 'right' : 'left' },
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholderText}
          placeholderTextColor={additionalColors.textLight}
          secureTextEntry={secureTextEntry && !isPasswordVisible}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          editable={editable}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {secureTextEntry && (
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.iconContainer}
          >
            <Ionicons
              name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={additionalColors.textLight}
            />
          </TouchableOpacity>
        )}
        
        {rightIcon && !secureTextEntry && (
          <View style={styles.iconContainer}>
            {rightIcon}
          </View>
        )}
      </View>
      
      {error && (
        <CustomText variant="small" color={additionalColors.error} style={styles.errorText}>
          {error}
        </CustomText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: additionalColors.border,
    borderRadius: 8,
    paddingHorizontal: 16,
    minHeight: 48,
  },
  inputContainerFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
  },
  inputContainerError: {
    borderColor: additionalColors.error,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Cairo-Regular',
    color: additionalColors.text,
    paddingVertical: 12,
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    marginTop: 4,
    marginLeft: 4,
  },
});

export default CustomInput;

