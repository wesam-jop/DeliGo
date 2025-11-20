/**
 * Utility functions لتطبيق خط Cairo
 */

/**
 * دالة لتطبيق خط Cairo على style object
 */
export const applyCairoFont = (baseStyle: any = {}) => {
  return {
    ...baseStyle,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  };
};

/**
 * دالة لتطبيق خط Cairo Bold
 */
export const applyCairoFontBold = (baseStyle: any = {}) => {
  return {
    ...baseStyle,
    fontFamily: 'Cairo_700Bold',
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  };
};

/**
 * دالة لتطبيق خط Cairo SemiBold
 */
export const applyCairoFontSemiBold = (baseStyle: any = {}) => {
  return {
    ...baseStyle,
    fontFamily: 'Cairo_600SemiBold',
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  };
};

/**
 * دالة لتطبيق خط Cairo على TextInput
 */
export const applyCairoFontToInput = (baseStyle: any = {}) => {
  return {
    ...baseStyle,
    fontFamily: 'Cairo_400Regular',
    textAlign: 'right' as const,
    writingDirection: 'rtl' as const,
  };
};

