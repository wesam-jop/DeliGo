import { TextStyle } from 'react-native';

/**
 * أنماط نصية موحدة مع خط Cairo
 * يمكن استخدامها في جميع أنحاء التطبيق
 */
export const textStyles = {
  // العناوين
  h1: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 32,
    lineHeight: 40,
    textAlign: 'right' as const,
  } as TextStyle,
  
  h2: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 24,
    lineHeight: 32,
    textAlign: 'right' as const,
  } as TextStyle,
  
  h3: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 20,
    lineHeight: 28,
    textAlign: 'right' as const,
  } as TextStyle,
  
  // النصوص العادية
  body: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right' as const,
  } as TextStyle,
  
  bodyBold: {
    fontFamily: 'Cairo_700Bold',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'right' as const,
  } as TextStyle,
  
  // النصوص الصغيرة
  small: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'right' as const,
  } as TextStyle,
  
  smallBold: {
    fontFamily: 'Cairo_600SemiBold',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'right' as const,
  } as TextStyle,
  
  // النصوص الصغيرة جداً
  tiny: {
    fontFamily: 'Cairo_400Regular',
    fontSize: 12,
    lineHeight: 16,
    textAlign: 'right' as const,
  } as TextStyle,
};

/**
 * دالة مساعدة لتطبيق خط Cairo على أي TextStyle
 */
export const applyCairoFont = (style?: TextStyle): TextStyle => {
  return {
    ...style,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'right',
    writingDirection: 'rtl',
  };
};

