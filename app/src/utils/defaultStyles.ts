import { TextStyle, ViewStyle, TextInputProps } from 'react-native';

/**
 * أنماط افتراضية لضمان تطبيق خط Cairo و RTL على جميع العناصر
 */

export const defaultTextStyle: TextStyle = {
  fontFamily: 'Cairo_400Regular',
  textAlign: 'right',
  writingDirection: 'rtl',
};

export const defaultViewStyle: ViewStyle = {
  direction: 'rtl',
};

export const defaultTextInputStyle: TextStyle = {
  fontFamily: 'Cairo_400Regular',
  textAlign: 'right',
  writingDirection: 'rtl',
};

/**
 * دالة مساعدة لتطبيق الأنماط الافتراضية على النصوص
 */
export const applyDefaultTextStyle = (style?: TextStyle | TextStyle[]): TextStyle[] => {
  const styles = Array.isArray(style) ? style : (style ? [style] : []);
  return [defaultTextStyle, ...styles];
};

/**
 * دالة مساعدة لتطبيق الأنماط الافتراضية على View
 */
export const applyDefaultViewStyle = (style?: ViewStyle | ViewStyle[]): ViewStyle[] => {
  const styles = Array.isArray(style) ? style : (style ? [style] : []);
  return [defaultViewStyle, ...styles];
};

