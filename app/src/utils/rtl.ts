import { I18nManager } from 'react-native';

/**
 * مساعد RTL للتطبيق
 * يوفر دوال مساعدة للتعامل مع الاتجاه من اليمين إلى اليسار
 */

/**
 * التحقق من حالة RTL
 */
export const isRTL = (): boolean => {
  return I18nManager.isRTL;
};

/**
 * الحصول على نمط الاتجاه للاستخدام في style
 */
export const getDirectionStyle = () => {
  return {
    direction: isRTL() ? 'rtl' : 'ltr' as 'rtl' | 'ltr',
    textAlign: isRTL() ? 'right' : 'left' as 'right' | 'left',
  };
};

/**
 * الحصول على margin start (يسار في LTR، يمين في RTL)
 */
export const getMarginStart = (value: number) => {
  return isRTL() ? { marginRight: value } : { marginLeft: value };
};

/**
 * الحصول على margin end (يمين في LTR، يسار في RTL)
 */
export const getMarginEnd = (value: number) => {
  return isRTL() ? { marginLeft: value } : { marginRight: value };
};

/**
 * الحصول على padding start
 */
export const getPaddingStart = (value: number) => {
  return isRTL() ? { paddingRight: value } : { paddingLeft: value };
};

/**
 * الحصول على padding end
 */
export const getPaddingEnd = (value: number) => {
  return isRTL() ? { paddingLeft: value } : { paddingRight: value };
};

