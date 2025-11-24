import { Platform } from 'react-native';

/**
 * Detect if running on emulator/simulator or real device
 */
export const isEmulator = () => {
  // For Android, we can check if it's an emulator
  // For iOS, simulator detection is more complex
  // For now, we'll use a simple check
  return __DEV__;
};

/**
 * Get the appropriate API URL based on the platform
 */
export const getApiBaseUrl = () => {
  const BASE_URL = __DEV__ 
    ? 'http://localhost:8000/api/v1' // Change to your IP for real devices
    : 'https://yourdomain.com/api/v1'; // Production URL
  
  // For Android Emulator, use special IP
  if (Platform.OS === 'android' && __DEV__) {
    // Android emulator uses 10.0.2.2 to access host machine's localhost
    return 'http://10.0.2.2:8000/api/v1';
  }
  
  // For iOS Simulator, localhost works
  if (Platform.OS === 'ios' && __DEV__) {
    return 'http://localhost:8000/api/v1';
  }
  
  return BASE_URL;
};

/**
 * Get helpful error message for network errors
 */
export const getNetworkErrorMessage = (error, baseURL) => {
  if (!error.response) {
    // Network error - no response from server
    const url = baseURL || 'الخادم';
    
    // Check if using localhost on real device
    if (url.includes('localhost') && !__DEV__) {
      return 'خطأ في إعدادات الـ API: لا يمكن استخدام localhost على الأجهزة الحقيقية. يرجى تغيير الـ URL إلى IP address جهازك في ملف config/api.js';
    }
    
    if (url.includes('localhost')) {
      return `⚠️ خطأ في الاتصال بالخادم\n\nالمشكلة: استخدام localhost على جهاز حقيقي\n\nالحل:\n1. افتح ملف: application/src/config/api.js\n2. غير localhost إلى IP address جهازك\n3. مثال: http://192.168.1.100:8000/api/v1\n\nللعثور على IP:\n- Windows: ipconfig في CMD\n- Mac/Linux: ifconfig في Terminal\n\nتأكد أيضاً:\n✅ الـ Server يعمل: php artisan serve --host=0.0.0.0\n✅ أنت على نفس شبكة Wi-Fi`;
    }
    
    return `لا يمكن الاتصال بالخادم (${url})\n\nتأكد من:\n1. الـ Server يعمل (php artisan serve --host=0.0.0.0)\n2. الـ URL صحيح في config/api.js\n3. أنت على نفس الشبكة (Wi-Fi)\n4. الـ Firewall لا يمنع الاتصال`;
  }
  
  return null;
};

