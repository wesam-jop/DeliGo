/**
 * ملف المساعدات (Utilities)
 * يمكنك إضافة دوال مساعدة هنا
 */

/**
 * دالة لتنسيق الأرقام
 */
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('ar-SA').format(num);
};

/**
 * دالة للتحقق من صحة البريد الإلكتروني
 */
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * دالة للتحقق من صحة رقم الجوال
 */
export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[0-9]{10}$/;
  return phoneRegex.test(phone);
};

/**
 * دالة لتأخير التنفيذ
 */
export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

